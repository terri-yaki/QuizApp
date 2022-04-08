import {Schema} from "mongoose";

//https://quizapi.io/docs/1.0/overview
export interface IQuizQuestion {
    qaid: number, //(Q)uiz (A)PI (ID).
    question: string,
    description?: string,
    answers: {
        name: string,
        correct: boolean
    }[],
    multiAnswers: boolean, //If this is true, multiple answers can be selected.
    explanation?: string,
    tip?: string,
    tags: string[],
    category: string,
    difficulty: string
}

export function getQuizQuestionSchema(){
    return new Schema<IQuizQuestion>({
        qaid: Number,
        question: String,
        description: {type: String, required: false},
        answers: [{name: String, correct: Boolean}],
        multiAnswers: Boolean,
        explanation: {type: String, required: false},
        tip: {type: String, required: false},
        tags: [String],
        category: String,
        difficulty: String
    });
}
