import axios from 'axios';
import {envVar, nullToUndefined} from "./general";
import { QuizQuestion } from './structs/Quiz';

const token = envVar("QUIZAPI_TOKEN");

/**
 * Makes a call to QuizAPI for a quiz.
 * @param topic The topic to retrieve a quiz for, "general" will provide questions from all topics.
 * @returns A quizAPI quiz.
 */
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

/**
 * Takes the QuizAPI JSON result and converts it into a QuizQuestion array.
 * @param data The QuizAPI JSON data from the API call.
 * @returns A QuizQuestionArray.
 */
function dataToQuestions(data: any): QuizQuestion[] { //This does not check data validity.W
    let questions:QuizQuestion[]  = [];

    for (let ques of data) {
        let {id, question, description, explanation, tip, category, difficulty} = ques;
        let multiAnswers = data.multiple_correct_answers=="true"; //More ==.
        let answers:{
            id: number,
            name: string,
            correct: boolean
        }[] = [];

        let i = 0;
        for (let ans of Object.entries(ques.answers)) {
            if (ans[1] !== null){
                answers.push({
                    id: i,
                    name: ans[1] as string,
                    correct: (ques.correct_answers[ans[0]  + "_correct"] == "true") //Double equals instead of triple deliberate.
                });
            }
            i++;
        }

        let tags:string[] = [];
        for (let tag of Object.entries(ques.tags)){
            if (tag[0] == "name"){
                tags.push(tags[1] as string);
            }
        }

        let qq: QuizQuestion = {
            id,
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

export async function getQuestionSet(topic: string): Promise<QuizQuestion[]> {
    let questions = await getQuizData(topic);
    return dataToQuestions(questions);
}
