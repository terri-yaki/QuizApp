import { connect } from "../../../utils/connection";
import APIError from "../../../utils/error/APIError";
import { NextApiRequest, NextApiResponse } from "next";
import { handleUserResponse } from "../../../utils/error/UserError";
import MUser from "../../../utils/models/MUser";
import { IUserSession } from "../../../utils/structs/User";
import { methodGuard } from "../../../utils/general";

const mUser = new MUser();
export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserSession | APIError>) {
    await connect();

    if (!methodGuard(["POST"], req, res)){
        return;
    }

    let emailAddr = req.body.emailAddress;
    let password = req.body.password;

    let user = mUser.userLogin(emailAddr, password);
    await handleUserResponse(user, res);
}