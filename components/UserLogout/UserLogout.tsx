import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from 'universal-cookie';

const UserLogout = () => {
    const cookies = new Cookies();
    const router = useRouter();

    useEffect(() => {
        cookies.remove('uuid');
        cookies.remove('name');
        cookies.remove('email');
        cookies.remove('token');
        cookies.remove('finishedQuiz');

        router.push('/').catch(e => console.log(e));
    }, []);

    return (
        <div id={'logout'}>
        </div>
    );
}

export default UserLogout;