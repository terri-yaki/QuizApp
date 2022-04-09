// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {IQuiz} from "../../../utils/structs/Quiz";
import APIError, * as error from '../../../utils/error/APIError';
import ErrorType from '../../../utils/error/ErrorType';
import MQuiz from '../../../utils/models/MQuiz';
import { connect } from '../../../utils/connection';
import { inspect } from 'util';
import { removePrivates } from '../../../utils/general';


const allowedTopics = [
    "general",
    "linux",
    "code",
    "devops",
    "cms",
    "sql",
];

const mQuiz = new MQuiz();
export default async function handler(req: NextApiRequest, res: NextApiResponse<IQuiz | APIError>) {
    await connect(); //Wait for database conn.

    if (req.method === "GET") {
        try {
            const category = req.query.category as string;
            if (allowedTopics.indexOf(category) > -1) {
                let quiz = await mQuiz.getTodaysQuiz(category);
                res.status(200).json(quiz);
            } else {
                res.status(400).json(new APIError(
                    ErrorType.Bad_Category,
                    "A quiz cannot be made using this category!"
                ));
            }
        } catch (e) {
            console.log(e);
            res.status(500).json(new APIError(
                ErrorType.Server_Error,
                "An internal server error occurred."
            ));
        }
    } else {
        res.status(400).end(new APIError(
            ErrorType.Invalid_Method,
            "The method you used is not valid for this."
        ));
    }
}
