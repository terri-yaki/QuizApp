import {Schema} from "mongoose";
import { IQuizQuestion } from "./QuizQuestion";

interface IQuizBase {
    date: Date;
    topic: string
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
        questions: [{type: Schema.Types.ObjectId, ref: "QuizQuestion"}]
    });
}