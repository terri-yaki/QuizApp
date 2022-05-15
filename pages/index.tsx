import type { NextPage } from 'next';

import UserHome from "../components/UserHome/UserHome";
import Sidebar from "../components/Sidebar/Sidebar";

const Home: NextPage = () => {
    return (
        <div id={'root'}>
            <Sidebar/>
            <UserHome/>
        </div>
    );
}

export default Home;