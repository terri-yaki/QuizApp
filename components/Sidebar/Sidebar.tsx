import 'bootstrap/dist/css/bootstrap.min.css';
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
            <div id={'sidebar'} className={Styles.sidebar}>
                <div className={"text-center"}>
                    <img src={'quizapp_logo.png'} width="200" height="200" className={"text-center"}></img>
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
            </div>
        )
    }

    return (
        <div id={'sidebar'} className={Styles.sidebar}>
            <div className={"text-center"}>
                <img src={'quizapp_logo.png'} width="200" height="200" className={"text-center"}></img>
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
        </div>
    )
}

export default Sidebar;