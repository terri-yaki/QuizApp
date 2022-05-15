import type { NextPage } from 'next';

import UserQuizSetup from "../components/UserQuizSetup/UserQuizSetup";
import Sidebar from "../components/Sidebar/Sidebar";

const Quiz: NextPage = () => {
    return (
        <div id={'root'}>
            <Sidebar/>
            <UserQuizSetup/>
        </div>
    );
}

export default Quiz;