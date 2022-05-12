import { NextApiResponse } from "next";
import { APIError, ErrorType } from "./APIError";

/**
 * Types of user error.
 * IMPORTANT: Remember to update other functions in this class when you modify this enum!!!!!
 */
export enum UserError {
    Invalid_Display_Name,
    Invalid_Email,
    Invalid_Password,
    Invalid_UUID,
    Incorrect_Password,
    Invalid_Token,
    User_Already_Exists,
    /**
     * Do not use this for failed login attempts!!!.
     */
    User_Does_Not_Exist
}

export function getStatusCode(err: UserError): number {
    switch (err) {
        case UserError.Invalid_Email:
        case UserError.Invalid_Display_Name:
        case UserError.Invalid_Password:
            return 400;
        case UserError.User_Already_Exists:
            return 409;
        case UserError.Incorrect_Password:
            return 401;
        case UserError.Invalid_Token:
            return 401;
        case UserError.User_Does_Not_Exist:
            return 404;
        default:
            return 500;

    }
}

export function getErrorMessage(err: UserError): string {
    switch (err) {
        case UserError.Invalid_Email:
            return "The email address provided is invalid.";
        case UserError.Invalid_Display_Name:
            return "The display name does not meet the requirements.";
        case UserError.Invalid_Password:
            return "The password does not meet the requirements.";
        case UserError.User_Already_Exists:
            return "A user is already registered with this email address.";
        case UserError.Invalid_Token:
            return "The session token is invalid.";
        case UserError.Incorrect_Password:
            return "This username and password combination is incorrect.";
        case UserError.User_Does_Not_Exist:
            return "This user does not exist.";
        default:
            return "An unknown user error occurred.";

    }
}

//TODO: Merge with code in QuizError (if possible)
export async function handleUserResponse<T>(prom: Promise<T | UserError>, res: NextApiResponse<T | APIError>){
    try {
        let result = await prom;
        if (typeof result === "number") {
            res.status(getStatusCode(result)).json(new APIError(
                ErrorType.User_Error,
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