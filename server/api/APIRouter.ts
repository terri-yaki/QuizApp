import express, { Router } from 'express';
import mongoose from 'mongoose';
import { TestAPI } from './TestAPI.js';

class APIRouter {
    public readonly router: Router;
    private cfg: any;

    private constructor(cfg: any) {
        this.cfg = cfg;
        this.router = this.makeRouter();
    }

    private makeRouter(): Router {
        const router = express.Router();
        const tapi = new TestAPI();

        router.use("/Test/", tapi.router);

        router.get("/", (req, res) => {
            res.end("Welcome to the API.");
        });

        router.get("/sayhello", (req, res) => {
            res.end("Hello World!");
        });

        return router;
    }

    private static async connectDB(uri: string) {
        return await mongoose.connect(uri);
    }

    public static new(cfg: any): Promise<APIRouter>{ //Async await doesnt work here because ts is dumb.
        return new Promise((resolve, reject) => {
            APIRouter.connectDB(cfg.db).then(() => {
                resolve(new APIRouter(cfg));
            }).catch(e=> {
                reject(e);
            });

        });
    }
}


export default APIRouter;
