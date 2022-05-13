// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {APIError} from '../../../utils/error/APIError';
import MQuiz from '../../../utils/models/MQuiz';
import { connect } from '../../../utils/connection';
import { methodGuard } from '../../../utils/general';
import { QuizPartial } from '../../../utils/structs/Quiz';
import { handleQuizResponse } from '../../../utils/error/QuizError';

const mQuiz = new MQuiz();
export default async function handler(req: NextApiRequest, res: NextApiResponse<QuizPartial | APIError>) {
    await connect(); //Wait for database conn.

    if (!methodGuard(["GET"], req, res)){
        return;
    }
    
    let category = req.query.category as string;
    let quiz_prom = mQuiz.getTodaysQuiz(category);
    return await handleQuizResponse(quiz_prom, res);
}
