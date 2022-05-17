import type { NextPage } from 'next';
import UserAccount from "../components/UserAccount/UserAccount";
import Sidebar from "../components/Sidebar/Sidebar";

const Account: NextPage = () => {
    return (
        <div id={'root'}>
            <Sidebar/>
            <UserAccount/>
        </div>
    );
}

export default Account;