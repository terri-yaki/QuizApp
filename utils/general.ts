//General utility functions and stuff like that.

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