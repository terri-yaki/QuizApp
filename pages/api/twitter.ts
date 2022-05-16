/*
 * API Endpoint for the app to connect to and create a websocket connection
 * ts-ignores are there due to the lack of typescript documentation for the socket.server property
 */

import {Server} from "socket.io";
import {NextApiRequest, NextApiResponse} from "next";
import {
    addTwitterRules, getTweets,
    loginTwitterAPI,
    streamTwitterTweets
} from "../../utils/twitter/twitter-helper";

// A boolean which causes the twitter client to only connect once
// Instead of it creating a new one for each request
let isTwitterConnected: boolean = false;

// Dev Boolean
// Should be false in production
let usingDummyTweets: boolean = false;

// Dev Counter
// Used for the dummy tweets
let counter = 0

const TwitterHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    let tweets: string[] = [];

    // Connects to twitter client and sets an interval for collecting tweets
    if (!usingDummyTweets) {
        if (!isTwitterConnected) {
            isTwitterConnected = true;

            loginTwitterAPI().catch(error => console.log(error));
            addTwitterRules().catch(error => console.log(error));
            streamTwitterTweets().catch(error => console.log(error));

            setInterval(() => {
                streamTwitterTweets().catch(error => console.log(error));
            }, 120000);
        }

        // Retrieve tweets and fills them with dummy tweets if necessary
        tweets = getTweets();

    } else {
        if (!isTwitterConnected) {
            isTwitterConnected = true;

            setInterval(() => {
                let id1 = counter;
                counter += 1;
                let id2 = counter;
                counter += 1;

                // Creating dummy tweets
                let json = JSON.stringify({
                    id: id1,
                    author: '12345',
                    name: 'John Doe',
                    username: 'twitter',
                    image: 'http://abc123',
                    tweet: 'tweet text',
                });
                let json2 = JSON.stringify({
                    id: id2,
                    author: '54321',
                    name: 'John Doe 2',
                    username: 'twitter',
                    image: 'http://abc321',
                    tweet: 'text tweet',
                });

                // Filling dummy tweets
                let t: string[] = [];
                t.push(json);
                t.push(json2);
                tweets = t;
            }, 12000)
        }


    }

    // @ts-ignore
    if (res.socket!.server.io) {
        console.log('Socket is already running');
    } else {
        console.log('Socket is initializing');
        // @ts-ignore
        const io = new Server(res.socket!.server);
        // @ts-ignore
        res.socket!.server.io = io;

        io.on('connection', socket => {
            socket.on('server:twitter', () => {
                console.log('sending tweet');
                socket.emit('client:twitter', {tweets});
            });
        });
    }

    res.end();
}

export default TwitterHandler;