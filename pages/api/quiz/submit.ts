import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { Validator } from "jsonschema";
import { methodGuard } from "../../../utils/general";
import MQuiz from "../../../utils/models/MQuiz";
import { getQuizSubmissionJSONSchema, QuizSubmissionUnmarkedUser, QuizSubmissionUser, toQuizSubmissionUser } from "../../../utils/structs/QuizSubmission";
import MUser from "../../../utils/models/MUser";
import { APIError, ErrorType } from "../../../utils/error/APIError";
import * as QuizError from "../../../utils/error/QuizError";
import * as UserError from "../../../utils/error/UserError";

const mQuiz = new MQuiz();
const mUser = new MUser();

export default async function handler(req: NextApiRequest, res: NextApiResponse<QuizSubmissionUser | APIError>) {
  await connect(); //Connect to db.
  
  if (!methodGuard(["POST"], req, res)){
    return;
  }
  let submission: QuizSubmissionUnmarkedUser & {userId: string, token: string} = req.body;
  let validator = new Validator();
  let isValid = validator.validate(submission, getQuizSubmissionJSONSchema()); //Validate against schema
  if (!isValid.valid){
    res.status(400).json(new APIError(
      ErrorType.Bad_Json,
      "The JSON submitted is not in the correct format."
    ));
    return;
  }

  let user = await mUser.getUserUnsafe(submission.userId, submission.token); //Find the associated user.

  if (typeof user === "number"){ //User could not be found.
    res.status(UserError.getStatusCode(user)).json(new APIError(
      ErrorType.User_Error,
      UserError.getErrorMessage(user),
      user
    ));
    return;
  }


  let existingSubmission = user.quizSubmissions.find(sub=>{
    return sub.quizId.toString() === submission.quizId;
  });

  let submitted;
  if (existingSubmission){ //We are appending to an existing submission.
    let existingSubmissionDoc = await mQuiz.getSubmissionByObjectId(existingSubmission.submissionId);
    if (typeof existingSubmissionDoc === "number"){
      throw "A submission for a user is missing! This does not make any sense.";
    }

    submitted = await mQuiz.submitQuizQuestions(submission, existingSubmissionDoc);
  } else {
    submitted = await mQuiz.submitQuizQuestions(submission); //Submit quiz.
  }

  if (typeof submitted === "number"){
    res.status(QuizError.getStatusCode(submitted)).json(new APIError(
      ErrorType.Quiz_Error,
      QuizError.getErrorMessage(submitted),
      submitted
    ));
    return;
  } else if (!existingSubmission){ //Add existing submission to user if it does not already exist.
    await mUser.addQuizSubmission(user, submitted); //Add user to the submissions.
  }

  res.status(200).json(
    toQuizSubmissionUser(submitted)
  );
}