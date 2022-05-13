import type { NextPage } from 'next';
import UserSignup from '../components/UserSignup/UserSignup';

const Signup: NextPage = () => {
    return (
        <div id={'root'}>
            <UserSignup/>
        </div>
    );
}

export default Signup;