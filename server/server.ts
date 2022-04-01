import express, { NextFunction } from 'express';
import next from 'next';
import * as fs from 'fs';
import * as process from 'process';
import { IncomingMessage, ServerResponse } from 'http';
import APIRouter from './api/APIRouter.js'; //Using JS extension because it seems to work...

//TODO: Detect dev environment.
//const devmode = process.env.NODE_ENV.toLowerCase() !== "production";
const devmode = true;
const app = next({dev: devmode});
const hldr = app.getRequestHandler();
const cfg = JSON.parse(fs.readFileSync("./config/config.json").toString())[devmode ? "dev" : "prod"];
app.prepare().then(() => {
    const mainServer = express(); 
    console.log("Loading Server.");
    const router = APIRouter.new(cfg).then((apiRouter)=>{
        mainServer.use("/apidb", apiRouter.router);
    
        mainServer.all("*", (req: IncomingMessage, res: ServerResponse) => {
            return hldr(req, res);
        });

        mainServer.listen(cfg.port);
        console.log("Ready!");
    });
});
