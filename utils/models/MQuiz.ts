import {Schema, Model} from "mongoose";
import * as mongoose from "mongoose";
import {IQuizDB, IQuiz, getQuizSchema} from "../structs/Quiz";
import {IQuizQuestion, getQuizQuestionSchema} from "../structs/QuizQuestion";
import * as quizapi from "../quizapi";
import {currentDay} from "../general";

const allowedTopics = [
    "general",
    "linux",
    "code",
    "devops",
    "cms",
    "sql",
];



let quizAPILock:Map<String, Promise<IQuiz>> = new Map(); //Lock to prevent double access of QuizAPI. This technically doesn't solve the concurrency bug entirely, but makes it unlikely to happen.

class MQuiz {
    private quizSchema:Schema;
    private questionSchema:Schema;
    private quizModel: mongoose.Model<IQuizDB>;
    private questionModel: mongoose.Model<IQuizQuestion>;

    constructor() {
        this.quizSchema = getQuizSchema();
        this.questionSchema = getQuizQuestionSchema();

        if (Object.hasOwn(mongoose.models, "Quiz")) {
            this.quizModel = mongoose.models["User"];
        } else {
            this.quizModel = mongoose.model<IQuizDB>("Quiz", this.quizSchema);
        }
        if (Object.hasOwn(mongoose.models, "QuizQuestion")) {
            this.questionModel = mongoose.models["QuizQuestion"];
        } else {
            this.questionModel = mongoose.model<IQuizQuestion>("QuizQuestion", this.questionSchema);
        }
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
     * Generates or loads a new quiz for today.
     * @param topic The topic of the quiz to find/generate.
     * @returns Today's quiz, or null if the category was invalid.
     */
    public async getTodaysQuiz(topic: string): Promise<IQuiz | null> { //Gets today's quiz from either the database or QuizAPI.
        if (typeof topic !== "string" || allowedTopics.indexOf(topic) < 0) {
            return null;
        }

        let today = currentDay();
        let dbQuiz = await this.loadQuizFromDB(today, topic);
        if (dbQuiz !== null){ //Return the quiz if found.
            return dbQuiz;
        } else {
            let quiz:IQuiz;
            if (quizAPILock.has(topic)) {
                quiz = await (quizAPILock.get(topic) as Promise<IQuiz>);
            } else {
                let quizPromise = this.generateNewQuiz(topic)
                quizAPILock.set(topic, quizPromise); //Add lock
                quiz = await quizPromise;
                quizAPILock.delete(topic); //Remove lock
            }
            return quiz;
        }
    }
}
export default MQuiz;