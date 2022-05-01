import mongoose from "mongoose";
import {Schema} from "mongoose";


export interface IUser {
    uuid: string,
    email: string,
    displayName: string,
}

export interface IUserUnsafe{
    email: string,
    displayName: string,
    passwordHash: string,
}

export type IUserUnsafeWithID = IUserUnsafe & {_id: mongoose.Types.ObjectId};

export function getUserSchema(){
    return new Schema({
        email: {
            type: String,
            unique: true
        },
        displayName: String,
        passwordHash: String
    });
}
/**
 * Strips out highly sensitive data (related to passwords and tokens).
 * @param user IUserUnsafe
 */
export function toUser(user: IUserUnsafeWithID): IUser {
    return {
        uuid: user._id.toString(),
        email: user.email,
        displayName: user.displayName
    };
}