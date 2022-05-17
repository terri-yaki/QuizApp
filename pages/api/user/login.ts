import { connect } from "../../../utils/connection";
import { NextApiRequest, NextApiResponse } from "next";
import { handleUserResponse } from "../../../utils/error/UserError";
import MUser from "../../../utils/models/MUser";
import { UserSession } from "../../../utils/structs/User";
import { methodGuard } from "../../../utils/general";
import { APIError } from "../../../utils/error/APIError";

const mUser = new MUser();
export default async function handler(req: NextApiRequest, res: NextApiResponse<UserSession | APIError>) {
    await connect();

    if (!methodGuard(["POST"], req, res)){
        return;
    }

    let emailAddr = req.body.emailAddress;
    let password = req.body.password;

    let user = mUser.userLogin(emailAddr, password);
    await handleUserResponse(user, res);
}