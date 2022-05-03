import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import {censorQuiz, getQuizSchema, IQuizDoc, IQuizFull, IQuizPartial} from "../structs/Quiz";
import * as quizapi from "../quizapi";
import {currentDay} from "../general";

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

let quizAPILock:Map<String, Promise<IQuizDoc>> = new Map(); //Lock to prevent double access of QuizAPI. This technically doesn't solve the concurrency bug entirely, but makes it unlikely to happen.

class MQuiz {
    private quizSchema:Schema;
    private quizModel: mongoose.Model<IQuizFull>;

    constructor() {
        this.quizSchema = getQuizSchema();

        if (Object.hasOwn(mongoose.models, "Quiz")) {
            this.quizModel = mongoose.models["Quiz"];
        } else {
            this.quizModel = mongoose.model<IQuizFull>("Quiz", this.quizSchema);
        }
    }

    /**
     * Generates a new quiz and stores it in the database.
     * @param topic The topic to generate with.
     * @returns The quiz.
     */
    private async generateNewQuiz(topic: string): Promise<IQuizDoc>{
        let questions = await quizapi.getQuestionSet(topic);
        let date = currentDay();

        let quizDoc: IQuizDoc = await new this.quizModel({
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
    private async getQuizByDate(date: Date, topic: string):Promise<IQuizDoc | null> {
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
    public async getTodaysQuiz(topic: string): Promise<IQuizPartial | null> { //Gets today's quiz from either the database or QuizAPI.
        if (typeof topic !== "string" || allowedTopics.indexOf(topic) < 0) {
            return null;
        }

        let today = currentDay();
        let quiz = await this.getQuizByDate(today, topic);
        if (quiz == null) {
            if (quizAPILock.has(topic)) {
                quiz = await (quizAPILock.get(topic) as Promise<IQuizDoc>);
            } else {
                let quizPromise = this.generateNewQuiz(topic)
                quizAPILock.set(topic, quizPromise); //Add lock
                quiz = await quizPromise;
                quizAPILock.delete(topic); //Remove lock
            }
        }
        
        return censorQuiz(quiz); //Return the quiz.
    }
}
export default MQuiz;