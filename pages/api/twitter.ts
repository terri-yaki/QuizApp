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
} from "../../helpers/twitter/twitter-helper";

// A boolean which causes the twitter client to only connect once
// Instead of it creating a new one for each request
let isTwitterConnected: boolean = false;

// Dev Boolean
// Should be false in production
let usingDummyTweets: boolean = true;

const TwitterHandler = async (req: NextApiRequest, res: NextApiResponse) => {

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
    }

    // Retrieve tweets and fills them with dummy tweets if necessary
    let tweets: string[] = getTweets();
    if (tweets.length == 0) {
        console.log('filling with dummy tweet');

        let json = JSON.stringify({
            id: '444',
            author: '12345',
            name: 'John Doe',
            image: 'http://abc123',
            tweet: 'tweet text',
        });

        let json2 = JSON.stringify({
            id: '445',
            author: '54321',
            name: 'John Doe 2',
            image: 'http://cba321',
            tweet: 'text tweet',
        });

        tweets.push(json);
        tweets.push(json2);
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