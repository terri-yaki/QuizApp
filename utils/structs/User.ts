import mongoose from "mongoose";
import {Schema} from "mongoose";


export interface IUser {
    uuid: string,
    email: string,
    displayName: string,
}

export type Session = {
    token: string,
    expiry: Date
}

export interface IUserSession extends IUser {
    session: Session
}

export interface IUserUnsafe{
    email: string,
    displayName: string,
    passwordHash: string,
    activeSessions: Session[]
}

export type UserDocument = IUserUnsafe & {_id: mongoose.Types.ObjectId} & mongoose.Document<unknown, any, IUserUnsafe>;

export function getUserSchema(){
    return new Schema({
        email: {
            type: String,
            unique: true
        },
        displayName: String,
        passwordHash: String,
        activeSessions: [{
            token: String,
            expiry: Date
        }]
    });
}
/**
 * Strips out highly sensitive data (related to passwords and tokens).
 * @param user IUserUnsafe
 */
export function toUser(user: UserDocument): IUser {
    return {
        uuid: user._id.toString(),
        email: user.email,
        displayName: user.displayName
    };
}