//General utility functions and stuff like that.

import { NextApiRequest, NextApiResponse } from "next";
import { APIError, ErrorType } from "./error/APIError";

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
 * Guards for invalid methods and the wrong content types.
 * @param validMethods Valid methods. In uppercase.
 * @param req request
 * @param res response
 * @param contentType (Optional) The required content-type for the request.
 * @returns If true, continue processing the request. If false, return from the method immediately.
 */
export function methodGuard<T>(validMethods: string[], req: NextApiRequest, res: NextApiResponse<T | APIError>, contentType?: string): boolean{
    if (contentType) {
        if (!req.headers["content-type"] || req.headers["content-type"] !== contentType) {
            ErrorType.Invalid_Content_Type,
            `The content type is incorrect. Please use Content-Type: '${contentType}'`
        }
    }
    
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