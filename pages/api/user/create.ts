import { connect } from "../../../utils/connection";
import { NextApiRequest, NextApiResponse } from "next";
import MUser from "../../../utils/models/MUser";
import APIError from "../../../utils/error/APIError";
import { IUserSession } from "../../../utils/structs/User";
import { handleUserResponse } from "../../../utils/error/UserError";
import { methodGuard } from "../../../utils/general";

const mUser = new MUser();
/**
 * For the love of god please do not put this on a forward facing server because it has no captcha or anything.
 * @param req 
 * @param res 
 * @returns 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserSession | APIError>) {
    await connect();

    if (!methodGuard(["POST"], req, res)){
        return;
    }
    
    let emailAddr = req.body.emailAddress;
    let displayName = req.body.displayName;
    let password = req.body.password;

    let userProm = mUser.createNewUser(emailAddr as string, displayName as string, password as string);
    await handleUserResponse(userProm, res);
}