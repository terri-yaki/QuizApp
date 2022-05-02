//General utility functions and stuff like that.

import { NextApiRequest, NextApiResponse } from "next";
import APIError from "./error/APIError";
import ErrorType from "./error/ErrorType";

export function envVar(varName: string): string {
    if (process.env[varName] === undefined) {
        throw new Error(`The environment variable ${varName} is not defined!`);
    } else {
        return process.env[varName] as string;
    }
}

export function currentDay(){ //Gets current day. THIS IS IN UTC!!!
    let d = new Date();
    d.setUTCHours(0,0,0,0);
    return d;
}

export function nullToUndefined<T>(data: T): T | undefined{
    if (data === null){
        return undefined;
    } else {
        return data;
    }
}

export function removePrivates(thing: any) {
    for (let [key, value] of Object.entries(thing)){
        if (key.startsWith("_")){
            delete thing[key];
        } else if (value instanceof Object) {
            removePrivates(thing[key]);
        }
    }
}

/**
 * Guards for invalid methods.
 * @param validMethods Valid methods. In uppercase.
 * @param req request
 * @param res response
 * @returns If true, continue processing the request. If false, return from the method immediately.
 */
export function methodGuard<T>(validMethods: string[], req: NextApiRequest, res: NextApiResponse<T | APIError>): boolean{
    if (!req.method || !validMethods.includes(req.method.toUpperCase())){
        res.status(400).json(new APIError(
            ErrorType.Invalid_Method,
            `The incorrect request type was used. Valid Methods: ${validMethods.toString()}`
        ));
        res.end();
        return false;
    } else {
        return true;
    }
}