import mongoose from "mongoose";
import {Schema} from "mongoose";


export interface User {
    uuid: string,
    email: string,
    displayName: string,
}

export type Session = {
    token: string,
    expiry: Date
}

export type SessionDocument = Session & mongoose.Types.Subdocument<mongoose.Types.ObjectId>; //TODO: figure out the actual correct type because this is wrong.

export interface UserSession extends User {
    session: Session
}

export interface UserQuizSubmission {
    quizId: mongoose.Types.ObjectId,
    submissionId: mongoose.Types.ObjectId
}

export interface UserUnsafe{
    email: string,
    displayName: string,
    passwordHash: string,
    activeSessions: mongoose.Types.DocumentArray<Session>,
    quizSubmissions: mongoose.Types.DocumentArray<UserQuizSubmission>
}

export type UserDocument = UserUnsafe & {_id: mongoose.Types.ObjectId} & mongoose.Document<unknown, any, UserUnsafe>;

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
        }],
        quizSubmissions:[{
            quizId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz'
            },
            submissionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Submission'
            }
        }]
    });
}
/**
 * Strips out highly sensitive data (related to passwords and tokens).
 * @param user IUserUnsafe
 */
export function toUser(user: UserDocument): User {
    return {
        uuid: user._id.toString(),
        email: user.email,
        displayName: user.displayName
    };
}