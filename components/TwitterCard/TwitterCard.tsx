import React from 'react';
import {ITweetData} from "../../helpers/twitter/ITweetData";
import styles from './TwitterCard.module.css'

// TODO: add link to account
// A card which contains all information on a tweet
const TwitterCard = (props: ITweetData) => {
    return (
        <div id={props.id} className={styles.twitterCard}>
            <img src={props.image} alt={'tweet image'}/>
            <p>{props.name}</p>
            <p>{props.tweet}</p>
        </div>
    )
}

export default TwitterCard;