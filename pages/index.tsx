import type {NextPage} from 'next';

import ExampleComponent from '../components/ExampleComponent/ExampleComponent';

const Home: NextPage = () => {
    return (
        <div id={'root'}>
            <ExampleComponent/>
        </div>
    );
}

export default Home;