import { connect } from "../../../utils/connection";
import { NextApiRequest, NextApiResponse } from "next";
import MUser from "../../../utils/models/MUser";
import APIError from "../../../utils/error/APIError";
import ErrorType from "../../../utils/error/ErrorType";
import { IUserSession, Session } from "../../../utils/structs/User";
import { getErrorMessage, getStatusCode, UserError } from "../../../utils/error/UserError";

const mUser = new MUser();
/**
 * For the love of god please do not put this on a forward facing server because it has no captcha or anything.
 * @param req 
 * @param res 
 * @returns 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserSession | APIError>) {
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

    try { //TODO: Refactor this and login.ts
        let user = await mUser.createNewUser(emailAddr as string, displayName as string, password as string);
        if(typeof user === "number") {
            res.status(getStatusCode(user)).json(new APIError(
                ErrorType.User_Error,
                getErrorMessage(user)
            ));
        } else {
            res.status(200).json(user);
        }
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