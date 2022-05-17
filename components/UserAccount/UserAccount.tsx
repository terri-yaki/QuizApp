import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import { Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <div id={'account'} className={'row justify-content-center'}>
                <Card className={"w-50 row justify-content-center align-items-center"}>
                    <Card.Body className={"row justify-content-center align-items-center"}>
                        <p className={'row justify-content-center'}>Welcome {name}</p>
                        <p className={'row justify-content-center'}>Your email is: {email}</p>
                        <p className={'row justify-content-center'}>Should you wish to delete your account, email us at &quot;quizapp@quizapp.com&quot; [not yet registered]</p>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return (
        <div id={'account'}>

        </div>
    );
}

export default UserAccount;