// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {APIError, ErrorType} from '../../../utils/error/APIError';
import MQuiz from '../../../utils/models/MQuiz';
import { connect } from '../../../utils/connection';
import { methodGuard } from '../../../utils/general';
import { QuizPartial } from '../../../utils/structs/Quiz';
import { getErrorMessage, getStatusCode, QuizError } from '../../../utils/error/QuizError';

const mQuiz = new MQuiz();
export default async function handler(req: NextApiRequest, res: NextApiResponse<QuizPartial | APIError>) {
    await connect(); //Wait for database conn.

    if (!methodGuard(["GET"], req, res)){
        return;
    }
    
    try {
        const category = req.query.category as string;
        let quiz = await mQuiz.getTodaysQuiz(category);
        if (typeof quiz === "number") {
            res.status(getStatusCode(quiz)).json(new APIError(
                ErrorType.Quiz_Error,
                getErrorMessage(quiz),
                quiz
            ));
        } else {
            res.status(200).json(quiz);
        }
    } catch (e) {
        console.log("Internal Server Error: ", e);
        res.status(500).json(new APIError(
            ErrorType.Server_Error,
            "An internal server error occurred."
        ));
    }
}
