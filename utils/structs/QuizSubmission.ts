import mongoose from "mongoose";
import {ObjectId} from "bson";
import {Schema} from "mongoose";
//I have decieded not to include a reference to the user since this will be owned by the user model.

/* 1. Quiz comes in as QuizSubmissionUnmarked
 * 2. Quiz is retrieved and marked and transformmed into a QuizSubmission.
 * 3. Quiz is stripped down and converted into QuizSubmission.
*/

interface QuizSubmissionUnmarkedBase { //Not used by itself.
  questions: UnmarkedQuestion[]
}

export interface QuizSubmissionUnmarkedUser extends QuizSubmissionUnmarkedBase { //For use by the user.
  quizId: string
}

interface QuizSubmissionBase extends QuizSubmissionUnmarkedBase { //Not used by itself.
  score: number,
  total: number,
  complete: boolean,
  lastUpdate: Date,
  questions: MarkedQuestion[],
}

export interface QuizSubmissionUser extends QuizSubmissionBase { //For use by the user.
  uuid: string,
  quizId: string
}

export interface QuizSubmission extends QuizSubmissionBase { //For use by the application.
  quizId: ObjectId
}

export type QuizSubmissionDoc = mongoose.Document<unknown, any, QuizSubmission> & QuizSubmission & {_id: mongoose.Types.ObjectId};

export interface UnmarkedQuestion {
  id: number,
  answers: UnmarkedAnswer[]
}

export interface MarkedQuestion extends UnmarkedQuestion {
  answers: MarkedAnswer[]
  allCorrect: boolean
}

export interface UnmarkedAnswer {
  id: number,
  selected: boolean
}

export interface MarkedAnswer extends UnmarkedAnswer {
  correct: boolean
}

export function getQuizSubmissionSchema(){
  return new Schema({
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    total: Number,
    complete: Boolean,
    lastUpdate: Date,
    questions: [{
      id: Number,
      allCorrect: Boolean,
      answers: [{
        id: Number,
        selected: Boolean,
        correct: Boolean
      }]
    }]
  });
}

/**
 * Strips out database data and converts the document to something to be sent to the client.
 * @param sub The quiz submission document.
 * @returns A quiz submission API response.
 */
export function toQuizSubmissionUser(sub: QuizSubmissionDoc): QuizSubmissionUser {
  let questions: MarkedQuestion[] = [];
  for (let q of sub.questions){ //Index questions
    let answers: MarkedAnswer[] = [];
    for (let a of q.answers){
      answers.push({
        id: a.id,
        selected: a.selected,
        correct: a.correct,
      });
    }
    questions.push({
      id: q.id,
      allCorrect: q.allCorrect,
      answers
    });
  }
  
  return {
    uuid: sub._id.toString(),
    quizId: sub.quizId.toString(),
    complete: sub.complete,
    score: sub.score,
    total: sub.total,
    lastUpdate: sub.lastUpdate,
    questions,
  }
}

export function getQuizSubmissionJSONSchema(){ //IMPORTANT: UPDATE API README.MD WHEN YOU CHANGE THIS!!!
  return {
    type: "object",
    required: true,
    properties: {
      userId: {
        type: "string",
        required: true
      },
      token: {
        type: "string",
        required: true
      },
      quizId: {
        type: "string",
        required: true
      },
      questions: {
        type: "array",
        required: true,
        items: {
          properties: {
            id: {
              type: "number",
              required: true
            },
            answers: {
              type: "array",
              required: true,
              items: {
                properties: {
                  id: {
                    type: "number",
                    required: true
                  },
                  selected: {
                    type: "boolean",
                    required: true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
