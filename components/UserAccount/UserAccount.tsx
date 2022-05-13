import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';

const UserAccount = () => {
    const cookies = new Cookies();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        setName(cookies.get('name'));
        setEmail(cookies.get('email'));
    }, []);

    if (name && email) {
        return (
            <div id={'account'}>
                <p>Welcome: {name}</p>
                <p>Your email is: {email}</p>
            </div>
        );
    }

    return (
        <div id={'account'}>

        </div>
    );
}

export default UserAccount;