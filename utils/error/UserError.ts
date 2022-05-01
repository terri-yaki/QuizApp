/**
 * Types of user error.
 * IMPORTANT: Remember to update other functions in this class when you modify this enum!!!!!
 */
export enum UserError {
    Invalid_Display_Name,
    Invalid_Email,
    Invalid_Password,
    Authentication_Failure,
    User_Already_Exists,
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
        case UserError.Authentication_Failure:
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
            return "A user is already registered with this email address."
        case UserError.Authentication_Failure:
            return "This username and password combination is incorrect.";
        case UserError.User_Does_Not_Exist:
            return "This user does not exist.";
        default:
            return "An unknown user error occurred.";

    }
}