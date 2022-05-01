import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { getUserSchema, IUser, IUserSession, IUserUnsafe, toUser, UserDocument, Session } from "../structs/User";
import { validateDisplayName, validateEmail, validatePassword } from "../user";
import { UserError } from "../error/UserError";

//LET ME KNOW IF YOU CHANGE THESE.
const SALT_ROUNDS = 10;
const TOKEN_DURATION = 24*60*60*1000;

let model: mongoose.Model<IUserUnsafe>;
class MUser {
    private userSchema;

    constructor() {
        this.userSchema = getUserSchema();
        if (typeof model === "undefined"){
            model = mongoose.model<IUserUnsafe>("User", this.userSchema);
        }
    }

    /**
     * Attempts to search for the given UUID in the database and return the user.
     * @param uuid The UUID of the user to search for.
     * @returns Either the user if found, or null (in this case you should 404).
     */
    public async getUserByUUID(uuid: string): Promise<UserDocument | null> {
        let instance = await model.findOne({
            uuid
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
    public async getUserByEmail(email: string): Promise<UserDocument | null> {
        let instance = await model.findOne({
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
        } else if (await this.getUserByEmail(email)) {
            return UserError.User_Already_Exists;
        }

        let passwordSalt = await bcrypt.genSalt(10);
        let passwordHash = await bcrypt.hash(password, passwordSalt);

        let instance = new model({
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

        let user = await this.getUserByEmail(email);

       if (user) {
           if (await bcrypt.compare(password, user.passwordHash)){
               return await this.createUserSession(user);
           } else {
               return UserError.Authentication_Failure;
           }
       } else {
           return UserError.Authentication_Failure;
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
}

export default MUser;