import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { getUserSchema, IUser, IUserSession, IUserUnsafe, toUser, UserDocument, Session, SessionDocument } from "../structs/User";
import { validateDisplayName, validateEmail, validatePassword } from "../user";
import { UserError } from "../error/UserError";

//LET ME KNOW IF YOU CHANGE THESE.
const SALT_ROUNDS = 10;
const TOKEN_DURATION = 24*60*60*1000;

//Just to let you know, the UUIDs in this aren't actually in UUID format anymore because Mongoose Object IDs are better.

class MUser {
    private userSchema;
    private userModel;
    /**
     * Inistantiates the user model.
     */
    constructor() {
    this.userSchema = getUserSchema();
        if (Object.hasOwn(mongoose.models, "User")){
            this.userModel = mongoose.models["User"];
        } else {
            this.userModel = mongoose.model<IUserUnsafe>("User", this.userSchema);
        }
    }


    /**
     * Attempts to search for the given UUID in the database and return the user.
     * @param uuid The UUID of the user to search for.
     * @returns Either the user if found, or null (in this case you should 404).
     * TODO: Make a safe version of this function.
     */
    private async getUserDocByUUID(uuid: string): Promise<UserDocument | null> {
        let oid;
        try {
            oid = mongoose.Types.ObjectId.createFromHexString(uuid);
        } catch (e){
            return null;
        }

        let instance = await this.userModel.findOne({
            _id: oid
        });

        if (instance) {
            return instance;
        } else {
            return null;
        }
    }

    /**
     * Searches for a user by their email address. Returns null if none could be found.
     * @param email The email address to search for.
     * @returns The user if found, otherwise null.
     */
    private async getUserDocByEmail(email: string): Promise<UserDocument | null> {
        let instance = await this.userModel.findOne({
            email
        });

        if (instance) {
            return instance;
        } else {
            return null;
        }
    }

    /**
     * Creates a new user.
     * @param email The email address of the user to create.
     * @param password The user's password
     * @returns A promise for UserSession or a UserError enum, depending if the opration was successful or not. If there is a serious error (a database problem), then the promise will be rejected.
     */
    public async createNewUser(email: string, displayName: string, password: string): Promise<IUserSession | UserError> {
        if (!validateEmail(email)) {
            return UserError.Invalid_Email;
        } else if (!validateDisplayName) {
            return UserError.Invalid_Display_Name;
        } else if (!validatePassword) {
            return UserError.Invalid_Password;
        } else if (await this.getUserDocByEmail(email)) {
            return UserError.User_Already_Exists;
        }

        let passwordSalt = await bcrypt.genSalt(10);
        let passwordHash = await bcrypt.hash(password, passwordSalt);

        let instance = new this.userModel({
            email,
            displayName,
            passwordHash,
            activeSessions: []
        });
        
        let savedInstance = await instance.save(); //This has potential to throw an error.

        return await this.createUserSession(savedInstance);
    }
    
    /**
     * Attempts to log in a user with the given email and password.
     * This does not check for length limits. You have been warned.
     * @param email 
     * @param password 
     */
    public async userLogin(email: string, password: string): Promise<IUserSession | UserError> {
        if (typeof email !== "string"){
            return UserError.Invalid_Email;
        } else if (typeof password !== "string") {
            return UserError.Invalid_Password;
        }

        let user = await this.getUserDocByEmail(email);

       if (user) {
           if (await bcrypt.compare(password, user.passwordHash)){
               return await this.createUserSession(user);
           } else {
               return UserError.Invalid_Password;
           }
       } else {
           return UserError.Invalid_Password;
       } 
    }
    
    /**
     * Private method to create a session for a user.
     * @param userDoc The mongoose object and document for the user.
     * @returns The UserSession object that has been made.
     */
    private async createUserSession(userDoc: UserDocument): Promise<IUserSession> {
        let token = crypto.randomBytes(32).toString("base64");
        let expiry = new Date(Date.now() + TOKEN_DURATION);
        let session: Session = {
            token,
            expiry
        }

        userDoc.activeSessions.push(session); //Update activesessions.
        await userDoc.save(); //Save the document.
        let userSession: IUserSession = toUser(userDoc) as IUserSession;
        userSession.session = session;

        return userSession;
    }

    /**
     * Checks if a user's session is valid.
     * @param userDoc The user document to validate.
     * @param token The token to check
     * @returns 
     */
    private validateSession(userDoc: UserDocument, token: string): SessionDocument | null {
        for (let session of userDoc.activeSessions) {
            if (session.token === token && session.expiry.getTime() > Date.now()) {
                return session; //Return the session if it is valid.
            }
        }
        return null;
    }

    /**
     * Logs a suer out of their session. Does not revoke other sessions.
     * @param uuid The ID of the user.
     * @param token The token to be revoked.
     * @returns True if successful, otherwise a UserError.
     */
    public async userLogout(uuid: string, token: string): Promise<true | UserError> {
        //TODO: Prune expired tokens as well.
        if (typeof uuid !== "string") {
            return UserError.Invalid_UUID;
        }

        let userDoc = await this.getUserDocByUUID(uuid);
        if (userDoc) {
            let session = this.validateSession(userDoc, token);
            if (session){
                session.remove();
                await userDoc.save();
                return true;
            } else { //Invalid session
                return UserError.Invalid_Token;
            } 
        } else { //User not found.
            return UserError.User_Does_Not_Exist;
        }
    }
}

export default MUser;