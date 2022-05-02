import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import APIError from "../../../utils/error/APIError";
import { handleUserResponse } from "../../../utils/error/UserError";
import { methodGuard } from "../../../utils/general";
import MUser from "../../../utils/models/MUser";

const mUser = new MUser();

export default async function handler(req: NextApiRequest, res: NextApiResponse<true | APIError>) {
    await connect();

    if (!methodGuard(["POST"], req, res)){
        return;
    }

    let uuid = req.body.uuid;
    let token = req.body.token;

    let revokeProm = mUser.userLogout(uuid, token);
    await handleUserResponse(revokeProm, res);
}