//https://dev.to/alexmercedcoder/building-a-full-stack-todo-list-with-mongodb-nextjs-typescript-2f75
import {Model} from "mongoose";
import * as mongoose from "mongoose";
import {envVar} from "./general";

export async function connect() {
    await mongoose.connect(envVar("DB_URL")).catch((e)=>{
        throw new Error("Failed to connect to the MongoDB database (this is very bad).");
    });
}