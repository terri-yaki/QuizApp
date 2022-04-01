import mg from "mongoose";
import ex from 'express';
import Test from "./Test.js";
export class TestAPI {
    public readonly router: ex.Router;
    private readonly schema: mg.Schema;
    private readonly model: mg.Model<Test>;
    

    public constructor() {
        this.router = this.initialiseRouter();
        this.schema = this.initialiseSchema();
        this.model = this.initialiseModel(this.schema);

    }

    private initialiseRouter(){
        const router = ex.Router();

        router.get("/dothing", async (req, res)=>{
            let thingy = new this.model({
                thing: "Hello there."
            });

            await thingy.save();

            res.end("Thingy saved.");
            
        });

        return router;
    }

    private initialiseSchema(){
        return new mg.Schema({
            thing: String
        });
    }

    private initialiseModel(schema: mg.Schema):mg.Model<Test>{
        return mg.model<Test>("test", schema);
    }
}
