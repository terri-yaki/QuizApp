import {Schema, Model} from "mongoose";
import * as mongoose from "mongoose";
import {IQuizDB, IQuiz, getQuizSchema} from "../structs/Quiz";
import {IQuizQuestion, getQuizQuestionSchema} from "../structs/QuizQuestion";
import * as quizapi from "../quizapi";
import {currentDay} from "../general";


class MQuiz {
    private quizSchema:Schema;
    private questionSchema:Schema;
    private quizModel;
    private questionModel;

    constructor() {
        this.quizSchema = getQuizSchema();
        this.questionSchema = getQuizQuestionSchema();
        this.quizModel = mongoose.model<IQuizDB>("Quiz", this.quizSchema);
        this.questionModel = mongoose.model<IQuizQuestion>("QuizQuestion", this.questionSchema);
    }

    private async saveQuestions(questions: IQuizQuestion[]){
        let qDocs = [];
        for (let q of questions){
            qDocs.push(new this.questionModel(q));
        }
        return await this.questionModel.bulkSave(qDocs);
    }

    private async generateNewQuiz(topic: string): Promise<IQuiz>{
        let questions = await quizapi.getQuestionSet(topic);
        
        let qDBData = await this.saveQuestions(questions);
        let date = currentDay();
        
        let oids:mongoose.Schema.Types.ObjectId[] = []; /*typescript doesnt let you have aliases because its bad */

        for (let id of qDBData.getInsertedIds()) {
            oids.push(id["_id"]);
        }
        console.log({
            date,
            topic,
            questions: oids
        });

        await (new this.quizModel({
            date,
            topic,
            questions: oids
        }).save()); //Save the quiz in the database
        
        return { //Return the generated quiz
            date,
            topic,
            questions
        }

    }

    
    /**
     * Gets a quiz from the database, using the data and topic.
     * @param date The date of the quiz, rounded to midnight UTC.
     * @param topic The topic of the quiz.
     * @returns The quiz, if it was found.
     */
    public async loadQuizFromDB(date: Date, topic: string):Promise<IQuiz | null> {
        let quiz = await this.quizModel.findOne({
            date,
            topic
        });
        
        if (quiz !== null){
            let populated = await (await quiz.populate("questions")).toObject() as unknown;
            return populated as IQuiz;
        } else {
            return null;
        }
    }


    
    /**
     * Generates or loads a new quiz for today. If you are reading this, remind Dom to fix the concurrency bug.
     * @param topic The topic of the quiz to find/generate.
     * @returns Today's quiz.
     */
    public async getTodaysQuiz(topic: string): Promise<IQuiz> { //Gets today's quiz from either the database or QuizAPI.
        //TODO: FIX A CONCURRENCY ERROR HERE WHERE generateNewQuiz CAN BE CALLED TWICE IN SHORT SUCCESSION...
        //... BECAUSE THE SECOND REQUEST MAY OCCUR BEFORE THE FIRST IS COMPLETED.
        let today = currentDay();
        let dbQuiz = await this.loadQuizFromDB(today, topic);
        if (dbQuiz !== null){ //Return the quiz if found.
            return dbQuiz;
        } else {
            return await this.generateNewQuiz(topic);
        }
    }
}
export default MQuiz;