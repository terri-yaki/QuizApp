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
}

export function getStatusCode(err: QuizError){
  switch (err) {
    case QuizError.Invalid_Category:
    case QuizError.Invalid_Quiz_Id:
    case QuizError.Invalid_Question:
    case QuizError.Missing_Answer:
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
  }
}

