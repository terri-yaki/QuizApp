import type { NextPage } from 'next';
import UserLogout from "../components/UserLogout/UserLogout";

const Logout: NextPage = () => {
    return (
        <div id={'root'}>
            <UserLogout/>
        </div>
    );
}

export default Logout;