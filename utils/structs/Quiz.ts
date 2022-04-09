import {Schema} from "mongoose";
import { stringify } from "querystring";
import { IQuizQuestion } from "./QuizQuestion";

interface IQuizBase {
    date: Date;
    topic: string;
}

export interface IQuizDB extends IQuizBase{
    questions: Schema.Types.ObjectId[];
}

export interface IQuiz extends IQuizBase{
    questions: IQuizQuestion[];
}

export function getQuizSchema(){
    return new Schema({
        date: Date,
        topic: String,
        questions: [{type: Schema.Types.ObjectId, ref: "QuizQuestion"}]
    });
}