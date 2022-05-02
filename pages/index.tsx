import type {NextPage} from 'next';
import ExampleComponent from '../components/ExampleComponent/ExampleComponent';
import TwitterStream from '../components/TwitterStream/TwitterStream'

const Home: NextPage = () => {
    // Twitter stream scroll functionality
    if (typeof window !== 'undefined') {
        let stream = document.getElementById('twitter-stream');
        setInterval(() => {
            if (stream != null) {
                stream.scroll({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        }, 13000)
    }

    return (
        <div id={'root'}>
            <ExampleComponent/>
            <TwitterStream/>
        </div>
    );
}

export default Home;