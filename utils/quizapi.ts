import axios from 'axios';
import * as fs from 'fs';
import {envVar, nullToUndefined} from "./general";
import {IQuizQuestion} from './structs/QuizQuestion.js';

const token = envVar("QUIZAPI_TOKEN");

async function getQuizData(topic: string){
    let response = await axios({
        url: "https://quizapi.io/api/v1/questions/",
        params: {
            apiKey: token,
            limit: 10,
            category: topic!=="general"?topic:undefined //Ignore the topic if it is "general".
        }
    })
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Bad status code: ${response.status}, ${response.statusText}`);
    }
}

function dataToQuestions(data: any): IQuizQuestion[] { //This does not check data validity.W
    let questions:IQuizQuestion[]  = [];

    for (let ques of data) {
        let {id, question, description, explanation, tip, category, difficulty} = ques;
        let multiAnswers = data.multiple_correct_answers=="true"; //More ==.
        let answers:{
            name: string,
            correct: boolean
        }[] = [];

        for (let ans of Object.entries(ques.answers)) {
            if (ans[1] !== null){
                answers.push({
                    name: ans[1] as string,
                    correct: (ques.correct_answers[ans[0]  + "_correct"] == "true") //Double equals instead of triple deliberate.
                });
            }
        }

        let tags:string[] = [];
        for (let tag of Object.entries(ques.tags)){
            if (tag[0] == "name"){
                tags.push(tags[1] as string);
            }
        }

        let qq: IQuizQuestion = {
            qaid: id,
            question,
            description: nullToUndefined(description as string),
            answers,
            multiAnswers,
            explanation:  nullToUndefined(explanation as string),
            tip: nullToUndefined(tip as string),
            tags: tags,
            category,
            difficulty
        };

        questions.push(qq);
    }
    
    return questions;
}

export async function getQuestionSet(topic: string): Promise<IQuizQuestion[]> {
    let questions = await getQuizData(topic);
    return dataToQuestions(questions);
}
