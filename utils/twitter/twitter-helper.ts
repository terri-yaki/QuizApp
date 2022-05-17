import {ETwitterStreamEvent, TweetV2SingleStreamResult, TwitterApi} from 'twitter-api-v2';

let client: TwitterApi;
let tweets: string[] = [];

// Creates Twitter API Client
export const loginTwitterAPI = async () => {
    client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    console.log('created client');
};

// TODO: complete function
export const deleteTwitterRules = async () => {

};

// TODO: change to quizapp
// Adds the rules to the Twitter API
export const addTwitterRules = async () => {
    await client.v2.updateStreamRules({
        add: [
            {value: 'JavaScript', tag: 'js'},
            {value: 'quizapp', tag: 'qa'},
        ],
    });
    console.log('added rules');
};

// Stream Tweets
export const streamTwitterTweets = async () => {

    console.log('starting stream');

    const stream = await client.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id'],
    });

    console.log('setup stream');

    let count: number = 0;

    stream.on(ETwitterStreamEvent.Data, async tweet => {
        // Ignore RTs
        const isARt = tweet.data.referenced_tweets?.some(tweet => tweet.type === 'retweeted') ?? false;

        if (isARt) {
            return null;
        }

        count = count + 1;

        if (count === 3) {
            console.log('Closing Stream');
            stream.close();
        }

        return await processTweet(tweet, count);

    });
};

// TODO: change nullability
// Processes the incoming tweets
const processTweet = async (tweet: TweetV2SingleStreamResult, count: number) => {
    let text: string = tweet.data.text;
    let author_id: string|undefined = tweet.data.author_id;

    if (text == null) {
        throw new Error;
    }

    if (author_id == null) {
        throw new Error;
    }

    let author_data = await getUserData(author_id);
    let profile_image_url: string = author_data.url;
    let author_name: string = author_data.name;
    let username: string = author_data.username;
    let id: string = tweet.data.id;

    if (profile_image_url == null) {
        throw new Error;
    }

    if (author_name == null) {
        throw new Error;
    }

    if (id == null) {
        throw new Error;
    }

    let json = JSON.stringify({
        id: id,
        author: author_id,
        name: author_name,
        username: username,
        image: profile_image_url,
        tweet: text,
    });

    console.log('grabbed tweet by: ' + author_name);

    tweets.push(json);

    if (tweets.length > 3) {
        tweets.shift();
    }

}

// Grabs any other data needed from the Twitter API
const getUserData = async (author_id: string) => {
    let author = await client.v2.user(author_id, { 'user.fields': ['profile_image_url', 'username'] });
    let profile_image_url = author.data.profile_image_url;
    let author_name = author.data.name;
    let username = author.data.username;

    if (profile_image_url == null) {
        throw new Error;
    }

    if (author_name == null) {
        throw new Error;
    }

    return {
        url: profile_image_url,
        name: author_name,
        username: username,
    };
}

// Getter
export const getTweets = () => {
    return tweets;
}