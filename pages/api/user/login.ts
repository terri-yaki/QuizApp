import { connect } from "../../../utils/connection";
import APIError from "../../../utils/error/APIError";
import { NextApiRequest, NextApiResponse } from "next";
import ErrorType from "../../../utils/error/ErrorType";
import { getErrorMessage, getStatusCode } from "../../../utils/error/UserError";
import MUser from "../../../utils/models/MUser";
import { IUserSession } from "../../../utils/structs/User";

const mUser = new MUser();
export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserSession | APIError>) {
    await connect();

    if(req.method != "POST") {
        res.status(400).json(new APIError(
            ErrorType.Invalid_Method,
            "You should use use a POST request to log in."
        ));

        return;
    }

    let emailAddr = req.body.emailAddress;
    let password = req.body.password;

    try { //TODO: Merge this and the same code in create.ts into one function to make it more efficient.
        let user = await mUser.userLogin(emailAddr, password);
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
            "An internal server error occured attempting to log in."
        ));
        return;
    }
}