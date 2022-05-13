import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { APIError } from "../../../utils/error/APIError";
import { handleQuizResponse } from "../../../utils/error/QuizError";
import { methodGuard } from "../../../utils/general";
import MQuiz from "../../../utils/models/MQuiz";
import { QuizScoreAverage } from "../../../utils/structs/QuizSubmission";

const mQuiz = new MQuiz();
export default async function handler(req: NextApiRequest, res: NextApiResponse<QuizScoreAverage | false | APIError>) {
    await connect();

    if (!methodGuard(["GET"], req, res)){
        return;
    }
    
    let quizId = req.query.id;

    let score_prom = mQuiz.getAverageScoreForQuiz(quizId as string);

    return await handleQuizResponse(score_prom, res);
}