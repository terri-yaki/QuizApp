import React, { useEffect, useState } from 'react';
import io, {Socket} from 'socket.io-client';
import TwitterCard from '../TwitterCard/TwitterCard'
import styles from './TwitterStream.module.css'
import {ITweetData} from "../../helpers/twitter/ITweetData";

let socket: Socket;

// The stream component which contains cards of tweets
const TwitterStream = () => {
    const [tweets, setTweets] = useState<any[]>([]);
    const tweetIDs: string[] = [];

    const socketInitializer = async () => {
        await fetch('/api/twitter');
        socket = io();

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('client:twitter', (msg) => {
            msg.tweets.forEach((tweet: string) => {
                let t: ITweetData = JSON.parse(tweet);

                if (!tweetIDs.includes(t.id)) {
                    setTweets(tweets => tweets.concat(t));
                    tweetIDs.push(t.id);
                }
            });
        });
    }

    useEffect(() => {
        socketInitializer().catch(error => console.log(error));

        setInterval(() => {
            console.log('requesting tweets');
            socket.emit('server:twitter');
        }, 12000);

    },[]);

    return (
        <div id={'twitter-stream'} className={styles.twitter}>
            {
                tweets.map((t) => {
                    return <TwitterCard key={t.id} id={t.id} author={t.author} tweet={t.tweet} image={t.image} name={t.name}/>
                })
            }
        </div>
    )
}

export default TwitterStream;