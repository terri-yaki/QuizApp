import type {NextPage} from 'next';
import ExampleComponent from '../components/ExampleComponent/ExampleComponent';
import TwitterStream from '../components/TwitterStream/TwitterStream'

import UserHome from "../components/UserHome/UserHome";
import Sidebar from "../components/Sidebar/Sidebar";

const Home: NextPage = () => {
    return (
        <div id={'root'}>
            <TwitterStream/>
            <Sidebar/>
            <UserHome/>
        </div>
    );
}

export default Home;