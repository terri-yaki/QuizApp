import { NextApiResponse } from "next";
import { APIError, ErrorType } from "./APIError";


export enum QuizError {
  Invalid_Category,
  Invalid_Quiz_Id,
  Quiz_Not_Found,
  Submission_Not_Found,
  Invalid_Question,
  Missing_Answer,
  Cannot_Overwrite,
  One_Choice_Only,
}

export function getStatusCode(err: QuizError){
  switch (err) {
    case QuizError.Invalid_Category:
    case QuizError.Invalid_Quiz_Id:
    case QuizError.Invalid_Question:
    case QuizError.Missing_Answer:
    case QuizError.One_Choice_Only:
      return 400;
    case QuizError.Quiz_Not_Found:
    case QuizError.Submission_Not_Found:
      return 404;
    case QuizError.Cannot_Overwrite:
      return 409;
  }
}

export function getErrorMessage(err: QuizError): string {
  switch (err) {
    case QuizError.Invalid_Category:
      return "This category does not exist.";
    case QuizError.Invalid_Quiz_Id:
      return "The quiz ID provided is invalid.";
    case QuizError.Quiz_Not_Found:
      return "This quiz does not exist.";
    case QuizError.Submission_Not_Found:
      return "A submission with this ID could not be found.";
    case QuizError.Invalid_Question:
      return "A question was given that is not in the quiz.";
    case QuizError.Missing_Answer:
      return "One of the questions has a missing answer.";
    case QuizError.Cannot_Overwrite:
      return "Quiz submissions cannot be overwritten.";
    case QuizError.One_Choice_Only:
      return "Single choice questions must have one choice selected, and only one choice."
  }
}

//Todo: Refactor with UerError.ts function because its similar (it might be too late to do this)
export async function handleQuizResponse<T>(prom: Promise<T | QuizError>, res: NextApiResponse<T | APIError>){
  try {
      let result = await prom;
      if (typeof result === "number") {
          res.status(getStatusCode(result)).json(new APIError(
              ErrorType.Quiz_Error,
              getErrorMessage(result),
              result
          ));
      } else {
          res.status(200).json(result);
      }
  } catch (e){
      console.error("An internal server error occurred:", e);
      res.status(500).json(new APIError(
          ErrorType.Server_Error,
          "An internal server error occurred."
      ));
  }
  res.end();
}