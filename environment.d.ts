/*
 * Creates an interface for the environment variables
 * variables should be set in '.env.local' file
 * do not push this file as it contains sensitive information
 *
 * Can add more variables freely
 */

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TWITTER_BEARER_TOKEN: string;
        }
    }
}

// Needed to run
export {}