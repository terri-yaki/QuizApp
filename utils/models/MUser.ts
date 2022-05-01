import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { getUserSchema, IUser, IUserUnsafe, toUser } from "../structs/User";

//LET ME KNOW IF YOU CHANGE THIS.
const SALT_ROUNDS = 10;

class MUser {
    private userSchema;
    private userModel;

    constructor() {
        this.userSchema = getUserSchema();
        this.userModel = mongoose.model<IUserUnsafe>("User", this.userSchema);
    }

    /**
     * Attempts to search for the given UUID in the database and return the user.
     * @param uuid The UUID of the user to search for.
     * @returns Either the user if found, or null (in this case you should 404).
     */
    public async getUserByUUID(uuid: string): Promise<IUser | null> {
        let instance = await this.userModel.findOne({
            uuid
        });

        if (instance) {
            return toUser(instance);
        } else {
            return null;
        }
    }

    /**
     * Searches for a user by their email address. Returns null if none could be found.
     * @param email The email address to search for.
     * @returns The user if found, otherwise null.
     */
    public async getUserByEmail(email: string): Promise<IUser | null> {
        let instance = await this.userModel.findOne({
            email
        });

        if (instance) {
            return toUser(instance);
        } else {
            return null;
        }
    }

    /**
     * Creates a new user. 
     * No checks are performed on the username or password.
     * @param username The username of the user to create.
     * @param password The user's password
     */
    public async createNewUser(email: string, displayName: string, password: string): Promise<IUser> {
        let passwordSalt = await bcrypt.genSalt(10);
        let passwordHash = await bcrypt.hash(password, passwordSalt);

        let instance = new this.userModel({
            email,
            displayName,
            passwordHash
        });
        
        let savedInstance = await instance.save(); //This has potential to throw an error.

        return toUser(savedInstance);
    }

}

export default MUser;