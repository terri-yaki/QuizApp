import type { NextPage } from 'next';
import UserLogin from "../components/UserLogin/UserLogin";

const Login: NextPage = () => {
    return (
        <div id={'root'}>
            <UserLogin/>
        </div>
    );
}

export default Login;