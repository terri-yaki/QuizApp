import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { APIError, ErrorType } from "../../../utils/error/APIError";
import { methodGuard } from "../../../utils/general";
import MQuiz from "../../../utils/models/MQuiz";
import MUser from "../../../utils/models/MUser";
import { QuizSubmissionUser, toQuizSubmissionUser } from "../../../utils/structs/QuizSubmission";
import * as QuizError from "../../../utils/error/QuizError";
import * as UserError from "../../../utils/error/UserError";
import { ApiError } from "next/dist/server/api-utils";

const mUser = new MUser();
const mQuiz = new MQuiz();

/**
 * Gets all quiz submissions for a user.
 * Requires authentication for that user.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<QuizSubmissionUser[] | APIError>) {
    await connect();

    if(!methodGuard(["GET"], req, res)){
        return;
    }

    let uuid = req.query.uuid;
    let token = req.query.token;

    let subIds = await mUser.getQuizSubmissionIds(uuid as string, token as string);

    if (typeof subIds === "number") {
        res.status(UserError.getStatusCode(subIds)).json(new APIError(
            ErrorType.User_Error,
            UserError.getErrorMessage(subIds),
            subIds
        ));
        return;
    }

    let subDocs = await mQuiz.getSubmissionByObjectIds(subIds);

    if (typeof subDocs === "number") {
        res.status(QuizError.getStatusCode(subDocs)).json(new APIError(
            ErrorType.Quiz_Error,
            QuizError.getErrorMessage(subDocs),
            subDocs
        ));
        return;
    }

    let submissions:QuizSubmissionUser[] = [];

    subDocs.forEach(doc => { //Convert submissions to user side readable.
        submissions.push(toQuizSubmissionUser(doc));
    });

    res.status(200).json(submissions); //OK.
}