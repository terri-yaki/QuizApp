import mongoose from "mongoose";
import {Schema} from "mongoose";

//For more information see: 
//https://quizapi.io/docs/1.0/overview

interface QuizBase {
    date: Date,
    topic: string,
}

export interface QuizPartial extends QuizBase { //This is what will be sent to the user.
    uuid: string,
    questions: QuizQuestionPartial[]
}

export interface QuizFull extends QuizBase { //The user should never see this struct.
    questions: QuizQuestion[]
}

export interface AnswerPartial {
    id: number,
    name: string
}

export interface Answer extends AnswerPartial {
    correct: boolean
}

export type QuizDoc = mongoose.Document<unknown, any, QuizFull> & QuizFull& {_id: mongoose.Types.ObjectId};

export interface QuizQuestionPartial {
    id: number, //(Q)uiz (A)PI (ID).
    question: string,
    description?: string,
    answers: AnswerPartial[],
    multiAnswers: boolean, //If this is true, multiple answers can be selected.
    tags: string[],
    category: string,
    difficulty: string
}

export interface QuizQuestion extends QuizQuestionPartial {
    answers: Answer[],
    explanation?: string,
    tip?: string,
    
}

export function getQuizSchema(){
    return new Schema({
        date: Date,
        topic: String,
        questions: [{
            id: Number,
            question: String,
            description: {type: String, required: false},
            answers: [{id: Number, name: String, correct: Boolean}],
            multiAnswers: Boolean,
            explanation: {type: String, required: false},
            tip: {type: String, required: false},
            tags: [String],
            category: String,
            difficulty: String
        }]
    });
}

export function censorQuiz(quiz: QuizDoc): QuizPartial {
    let partialQuestions: QuizQuestionPartial[] = [];
    for (let q of quiz.questions) {
        let ans:AnswerPartial[] = [];
        
        for (let a of q.answers){
            ans.push({
                id: a.id,
                name: a.name
            });
        }

        partialQuestions.push({
            id: q.id,
            question: q.question,
            description: q.description,
            answers: ans,
            multiAnswers: q.multiAnswers,
            tags: q.tags,
            category: q.category,
            difficulty: q.difficulty
        });
    }

    return {
        uuid: quiz._id.toString(),
        date: quiz.date,
        questions: partialQuestions,
        topic: quiz.topic
    }
}