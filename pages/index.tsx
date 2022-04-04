import type {NextPage} from 'next';
import ExampleComponent from '../components/ExampleComponent/ExampleComponent';
import TwitterStream from '../components/TwitterStream/TwitterStream'

const Home: NextPage = () => {
    return (
        <div id={'root'}>
            <ExampleComponent/>
            <TwitterStream/>
        </div>
    );
}

export default Home;