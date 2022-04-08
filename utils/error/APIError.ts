import ErrorType from "./ErrorType"

export default class APIError {
    //todo finish.
    public type: ErrorType;
    public message:string;
    public error = true;
    
    constructor(type: ErrorType, message: string){
        this.type = type;
        this.message = message;
    }
    
}




