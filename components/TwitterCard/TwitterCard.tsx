import React from 'react';
import {ITweetData} from "../../helpers/twitter/ITweetData";

// TODO: add link to account
// A card which contains all information on a tweet
const TwitterCard = (props: ITweetData) => {
    return (
        <div id={props.id}>
            <p>{props.name}</p>
            <p>{props.tweet}</p>
            <img src={props.image} alt={'tweet image'}/>
        </div>
    )
}

export default TwitterCard;