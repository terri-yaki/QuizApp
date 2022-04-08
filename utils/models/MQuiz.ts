import {Schema, Model} from "mongoose";
import * as mongoose from "mongoose";
import {connect} from "../connection";
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

        await (new this.quizModel({
            date: date,
            questions: oids
        }).save()); //Save the quiz in the database

        return { //Return the generated quiz
            date: date,
            topic: topic,
            questions: questions
        }

    }

    public async loadQuizFromDB(date: Date, topic: string):Promise<IQuiz | null> {
        let quiz = await this.quizModel.findOne({
            date,
            topic
        });
        if (quiz !== null){
            let populated = await quiz.populate("questions") as unknown;
            return populated as IQuiz;
        } else {
            return null;
        }
    }

    public async getTodaysQuiz(topic: string): Promise<IQuiz> { //Gets today's quiz from either the database or QuizAPI.
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