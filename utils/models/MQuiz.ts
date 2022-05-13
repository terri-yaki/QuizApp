import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import {ObjectId} from "bson";
import {censorQuiz, getQuizSchema, QuizDoc, QuizFull, QuizPartial, QuizQuestion} from "../structs/Quiz";
import * as quizapi from "../quizapi";
import {currentDay} from "../general";
import { getQuizSubmissionSchema, MarkedAnswer, MarkedQuestion, QuizSubmission, QuizSubmissionDoc, QuizSubmissionUnmarkedUser, QuizSubmissionUser } from "../structs/QuizSubmission";
import { loadModel } from "../connection";
import { QuizError } from "../error/QuizError";
/**
 * LIst of allowed topics.
 */
const allowedTopics = [
    "general",
    "linux",
    "code",
    "devops",
    "cms",
    "sql",
];

let quizAPILock:Map<String, Promise<QuizDoc>> = new Map(); //Lock to prevent double access of QuizAPI. This technically doesn't solve the concurrency bug entirely, but makes it unlikely to happen.

class MQuiz {
    private quizModel: mongoose.Model<QuizFull>;
    private subModel: mongoose.Model<QuizSubmission>;

    constructor() {
        this.quizModel = loadModel("Quiz", getQuizSchema());
        this.subModel = loadModel("QuizSubmission", getQuizSubmissionSchema());       
    }

    /**
     * Generates a new quiz and stores it in the database.
     * @param topic The topic to generate with.
     * @returns The quiz.
     */
    private async generateNewQuiz(topic: string): Promise<QuizDoc>{
        let questions = await quizapi.getQuestionSet(topic);
        let date = currentDay();

        let quizDoc: QuizDoc = await new this.quizModel({
            date,
            questions,
            topic
        }).save();

        return quizDoc;
    }

    
    /**
     * Gets a quiz from the database, using the data and topic.
     * @param date The date of the quiz, rounded to midnight UTC.
     * @param topic The topic of the quiz.
     * @returns The quiz, if it was found.
     */
    private async getQuizByDate(date: Date, topic: string):Promise<QuizDoc | null> {
        return await this.quizModel.findOne({
            date,
            topic
        });
    }

    /**
     * Generates or loads a new quiz for today.
     * @param topic The topic of the quiz to find/generate.
     * @returns Today's quiz, or null if the category was invalid.
     */
    public async getTodaysQuiz(topic: string): Promise<QuizPartial | QuizError> { //Gets today's quiz from either the database or QuizAPI.
        if (typeof topic !== "string" || allowedTopics.indexOf(topic) < 0) {
            return QuizError.Invalid_Category;
        }

        let today = currentDay();
        let quiz = await this.getQuizByDate(today, topic);
        if (quiz == null) {
            if (quizAPILock.has(topic)) {
                quiz = await (quizAPILock.get(topic) as Promise<QuizDoc>);
            } else {
                let quizPromise = this.generateNewQuiz(topic)
                quizAPILock.set(topic, quizPromise); //Add lock
                quiz = await quizPromise;
                quizAPILock.delete(topic); //Remove lock
            }
        }
        
        return censorQuiz(quiz); //Return the quiz.
    }

    /**
     * Retrieve a quiz by its UUID.
     * @param id The UUID of the quiz.
     * @returns The quiz (but without the correct answers).
     */
    public async getQuizById(id: string): Promise<QuizPartial | QuizError> {
        let oid: ObjectId;
        try {
            oid = mongoose.Types.ObjectId.createFromHexString(id);
        } catch (e) {
            return QuizError.Invalid_Quiz_Id;
        }

        let quiz = await this.quizModel.findById(oid);

        if (!quiz) {
            return QuizError.Quiz_Not_Found;
        }

        return censorQuiz(quiz);
    }

    /**
     * Marks and saves a quiz submission from a user.
     * @param sub The user data that has been submitted.
     * @param existingSub An exsisting submission document to overwrite, if there is one.
     * @returns The submission document that has been saved in the database, or an error if the submission failed.
     */
    public async submitQuizQuestions(sub: QuizSubmissionUnmarkedUser, existingSub?: QuizSubmissionDoc): Promise<QuizSubmissionDoc | QuizError>{
        if (existingSub && existingSub.quizId.toString() !== sub.quizId){ //Prevent mistakes from happening here.
            throw "existingSub cannot be null if the user requested an append to an existing submission!";
        }
        
        let quizId: ObjectId;
        try {
            quizId = mongoose.Types.ObjectId.createFromHexString(sub.quizId);
        } catch(e) { //Quiz ID is invalid.
            return QuizError.Invalid_Quiz_Id;
        }

        let quiz = await this.quizModel.findById(quizId);
        
        if (!quiz) { //Quiz not found.
            return QuizError.Quiz_Not_Found;
        }

        let markedQs: MarkedQuestion[] = [];
        let score = 0; //Number of questions that are all correct.

        for (let subQ of sub.questions) { //Index questions in submission.
            let correspondingQ = quiz.questions.find((question) => {
                return question.id === subQ.id
            });

            if (!correspondingQ) { //Quiz question was not found.
                return QuizError.Invalid_Question;
            }

            let markedAs: MarkedAnswer[] = [];
            let allCorrect = true;
            let numberSelected = 0;

            for (let correctAns of correspondingQ.answers) { //Index answers.
                let subA = subQ.answers.find((ans)=>{
                    return ans.id === correctAns.id;
                });

                if (!subA) { //An answer was missing.
                    return QuizError.Missing_Answer;
                }

                let isCorrect = correctAns.correct === subA.selected;
                
                if (!isCorrect) { //Mark it so that not all the questions are correct.
                    allCorrect = false;
                }

                if (subA.selected) {
                    numberSelected++;
                }

                markedAs.push({
                    id: subA.id,
                    selected: subA.selected,
                    correct: isCorrect
                });
            }

            if (allCorrect) { //Grant score if all the questions are correct.
                score++;
            }

            if (!correspondingQ.multiAnswers && numberSelected !== 1) { //Either none or many answers were selected in a question where there is only one right answer.
                return QuizError.One_Choice_Only;
            }

            markedQs.push({
                id: subQ.id,
                answers: markedAs,
                allCorrect
            });
        }

        if (existingSub) { //If there is already a document for that submission.
            for (let markedQ of markedQs){ //Check to make sure questions have not already been submitted.
                if (existingSub.questions.find((submittedQ)=>{ //Check if the question has already been submitted.
                    return markedQ.id === submittedQ.id
                })) { //If so then return null since overwriting is not allowed.
                    return QuizError.Cannot_Overwrite;
                }
            }

            for (let markedQ of markedQs) { //Now add them to the existing submission.
                existingSub.questions.push(markedQ);
            }

            existingSub.score += score; //Increment total score.
            existingSub.total += markedQs.length; //Add to number of questions done.
            existingSub.lastUpdate = new Date(); //Update last update.

            if (existingSub.questions.length === quiz.questions.length) { //Check if the quiz is totally complete.
                existingSub.complete = true;
            }

            existingSub.save(); //Save changes.
            return existingSub;
        } else { //Create a new submission.
            let complete = markedQs.length === quiz.questions.length;

            let sub: QuizSubmission = {
                quizId,
                score,
                total: markedQs.length,
                complete,
                questions: markedQs,
                lastUpdate: new Date() //Current date right now
            };

            return await new this.subModel(sub).save();
        }    
    }

    /**
     * Retrieves a submission by it's database document objectId.
     * @param oid The object ID to retrieve the submission for.
     * @returns 
     */
    public async getSubmissionByObjectId(oid: mongoose.Types.ObjectId): Promise<QuizSubmissionDoc | QuizError>{ //Invalid object IDs should not be possible.
        let doc = await this.subModel.findById(oid);

        if (!doc){
            return QuizError.Quiz_Not_Found;
        } else {
            return doc;
        }
    }

}
export default MQuiz;