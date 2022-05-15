import type { NextPage } from 'next';
import UserLogin from "../components/UserLogin/UserLogin";
import Sidebar from "../components/Sidebar/Sidebar";

const Login: NextPage = () => {
    return (
        <div id={'root'}>
            <Sidebar/>
            <UserLogin/>
        </div>
    );
}

export default Login;