import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { APIError, ErrorType } from "../../../utils/error/APIError";
import { getErrorMessage, getStatusCode, handleQuizResponse } from "../../../utils/error/QuizError";
import { methodGuard } from "../../../utils/general";
import MQuiz from "../../../utils/models/MQuiz";
import { QuizPartial } from "../../../utils/structs/Quiz";

const mQuiz = new MQuiz();

export default async function handler(req: NextApiRequest, res: NextApiResponse<QuizPartial | APIError>) {
    await connect(); //Connect to database.

    if (!methodGuard(["GET"], req, res)) { //Force get requests only.
        return;
    }

    let quiz_prom = mQuiz.getQuizById(req.query.id.toString()); //Create a quiz from the ID.

    return await handleQuizResponse(quiz_prom, res);
}