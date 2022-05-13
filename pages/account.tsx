import type { NextPage } from 'next';
import UserAccount from "../components/UserAccount/UserAccount";

const Account: NextPage = () => {
    return (
        <div id={'root'}>
            <UserAccount/>
        </div>
    );
}

export default Account;