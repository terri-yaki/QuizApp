export class APIError {
    public type: ErrorType;
    public message:string;
    public error = true;
    public subError:number;
    
    constructor(type: ErrorType, message: string, subError?: number){
        if ((type === ErrorType.User_Error || type === ErrorType.Quiz_Error) && !subError){
            throw "A suberror was required and not provided!";
        }

        this.type = type;
        this.message = message;
        if (subError){
            this.subError = subError;
        } else {
            this.subError = -1;
        }
    }   
}

export enum ErrorType {
    Invalid_Method,
    Invalid_Content_Type,
    Server_Error,
    User_Error,
    Quiz_Error,
    Bad_Json,
}