import Cookies from 'universal-cookie';
import { useEffect, useState } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import UserQuiz from "../UserQuiz/UserQuiz";

const UserQuizSetup = () => {
    const [alreadyFinished, setAlreadyFinished] = useState(false);
    const [quizChoice, setQuizChoice] = useState("");

    useEffect(() => {
        const cookies = new Cookies();
        let completed = cookies.get('finishedQuiz');
        if (completed === "true") {
            setAlreadyFinished(true);
            return;
        }
    },[]);

    const updateChoice = (val: any) => {
        console.log(val);
        setQuizChoice(val);
    }

    if (alreadyFinished) {
        return (
            <div id={'quiz-setup'} className={'row justify-content-center'}>
                <Card className={"w-50 row justify-content-center align-items-center"}>
                    <Card.Body>
                        <div className={'row justify-content-center'}>
                            <p>You have already finished the quiz for today</p>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    if (quizChoice) {
        return (
            <UserQuiz choice={quizChoice}/>
        )
    }

    return (
        <div id={'quiz-setup'} className={'row justify-content-center'}>
            <Card className={"w-50 row justify-content-center align-items-center"}>
                <Card.Body className={'row justify-content-center'}>
                    <DropdownButton onSelect={updateChoice} title={'Select a Topic'} className={'row justify-content-center'}>
                        <Dropdown.Item eventKey="general">general</Dropdown.Item>
                        <Dropdown.Item eventKey="linux">linux</Dropdown.Item>
                        <Dropdown.Item eventKey="code">code</Dropdown.Item>
                        <Dropdown.Item eventKey="devops">devops</Dropdown.Item>
                        <Dropdown.Item eventKey="cms">cms</Dropdown.Item>
                        <Dropdown.Item eventKey="sql">sql</Dropdown.Item>
                    </DropdownButton>
                </Card.Body>
            </Card>
        </div>
    )

}

export default UserQuizSetup;