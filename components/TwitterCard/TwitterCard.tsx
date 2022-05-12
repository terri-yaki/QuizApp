import React from 'react';
import {ITweetData} from "../../utils/twitter/ITweetData";
import styles from './TwitterCard.module.css'

// A card which contains all information on a tweet
const TwitterCard = (props: ITweetData) => {
    let url = 'https://www.twitter.com/' + props.username;

    return (
        <div id={props.id} className={styles.twitterCard}>

            <div className={styles.profile}>
                <img src={props.image} alt={'profile image'}/>

                <a href={url} className={styles.usernameLink}>
                    <p className={styles.username}>{props.name}</p>
                </a>
            </div>

            <p>{props.tweet}</p>
        </div>
    )
}

export default TwitterCard;