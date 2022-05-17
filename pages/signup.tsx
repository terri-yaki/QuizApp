import type { NextPage } from 'next';
import UserSignup from '../components/UserSignup/UserSignup';
import Sidebar from "../components/Sidebar/Sidebar";

const Signup: NextPage = () => {
    return (
        <div id={'root'}>
            <Sidebar/>
            <UserSignup/>
        </div>
    );
}

export default Signup;