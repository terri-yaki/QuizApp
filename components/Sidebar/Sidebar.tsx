import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/w3.css';
import Styles from './Sidebar.module.css';
import Link from 'next/link'
import Cookies from 'universal-cookie';
import {useEffect, useState} from "react";

const Sidebar = () => {
    const [name, setName] = useState();

    useEffect(() => {
        const cookies = new Cookies();
        setName(cookies.get('name'));
    }, []);

    if (name) {
        return (
            <nav id={'navbar'} className={Styles.sidebar}>
                <div className={"w3-sidebar w3-blue w3-collapse w3-top w3-large w3-padding sidenav"}>
                    <img src={'res/quizapp_logo_2.png'} width="200" height="200" className={"text-center"}></img>
                </div>


                <ul className="nav flex-column">
                    <li className="nav-item m-3 text-center h3">
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </li>
                    <li className="nav-item m-3 text-center h3">
                        <Link href="/quiz">
                            <a>Quiz</a>
                        </Link>
                    </li>
                    <li className="nav-item m-3 text-center h3">
                        <Link href="/account">
                            <a>Account</a>
                        </Link>
                    </li>
                    <li className="nav-item m-3 text-center h3">
                        <Link href="/signup">
                            <a>Signup</a>
                        </Link>
                    </li>
                    <li className="nav-item m-3 text-center h3">
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </li>
                    <li className="nav-item m-3 text-center h3">
                        <Link href="/logout">
                            <a>Logout</a>
                        </Link>
                    </li>
                </ul>

                <br/>

                <div>
                    <p className={Styles.name}>You are currently signed in as:</p>
                    <p className={Styles.name}>{name}</p>
                </div>
            </nav>
        )
    }

    return (
        <nav id={'navbar'} className={Styles.sidebar}>
            <div className={"text-center w3-padding sidenav"}>
                <img src={'res/quizapp_logo_2.png'} width="200" height="200" className={"text-center"}></img>
            </div>

            <ul className="nav flex-column w3-bar-block">
                <li className="nav-item m-3 text-center h3 border border-secondary">
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li className="nav-item m-3 text-center h3">
                    <Link href="/quiz">
                        <a>Quiz</a>
                    </Link>
                </li>
                <li className="nav-item m-3 text-center h3">
                    <Link href="/signup">
                        <a>Signup</a>
                    </Link>
                </li>
                <li className="nav-item m-3 text-center h3">
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </li>
                <li className="nav-item m-3 text-center h3">
                    <Link href="/logout">
                        <a>Logout</a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Sidebar;