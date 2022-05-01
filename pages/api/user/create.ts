import { connect } from "../../../utils/connection";
import { NextApiRequest, NextApiResponse } from "next";
import MUser from "../../../utils/models/MUser";
import APIError from "../../../utils/error/APIError";
import ErrorType from "../../../utils/error/ErrorType";
import { validateDisplayName, validateEmail, validatePassword } from "../../../utils/user";
import { IUser } from "../../../utils/structs/User";

const mUser = new MUser();
/**
 * For the love of god please do not put this on a forward facing server because it has no captcha or anything.
 * @param req 
 * @param res 
 * @returns 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IUser | APIError>) {
    await connect();

    if (req.method != "POST") { //POST guard.
        res.status(400).json(new APIError(
            ErrorType.Invalid_Method,
            "You should use use a POST request to create a user."
        ));

        return;
    }
    
    let emailAddr = req.body.emailAddress;
    let displayName = req.body.displayName;
    let password = req.body.password;
    if (!validateEmail(emailAddr)) {
        res.status(400).json(new APIError(
            ErrorType.Invalid_Email,
            "The email address provided is invalid."
        ));
        return;
    }

    if (!validateDisplayName(displayName)) {
        res.status(400).json(new APIError(
            ErrorType.Invalid_Display_Name, 
            "The display name does not meet the requirements."
        ));
        return;
    }

    if (!validatePassword(password)) {
        res.status(400).json(new APIError(
            ErrorType.Invalid_Password,
            "The password does not meet the requirements."
        ));
        return;
    }

    if (await mUser.getUserByEmail(emailAddr)){ //Check if there is already a user with this email address.
        res.status(409).json(new APIError(
            ErrorType.User_Already_Exists,
            "A user is already registered with this email address."
        ));
        return;
    }

    try {
        let user = await mUser.createNewUser(emailAddr as string, displayName as string, password as string);
        res.status(200).json(user);
        return;
    } catch (e) {
        console.error("An error occurred:", e);
        res.status(500).json(new APIError(
            ErrorType.Server_Error,
            "An internal server error occured attempting to create this account."
        ));
        return;
    }
}