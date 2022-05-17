import { Button, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
const axios = require("axios");
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AxiosResponse } from "axios";

let questions: any[];

let userQuestions: any[] = [];
let quizID: string;
let isChecked: any[] = [];

interface IProps {
    choice: string
}

const UserQuiz = (props: IProps) => {
    const [num, setNum] = useState(-1);
    const [finished, setFinished] = useState(false);
    const [hasQuizStarted, setHasQuizStarted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const collectData = async () => {
            let url = "/api/quiz/" + props.choice;

            axios.get(url).then((res: any) => {
                if (res.status != 200) {
                    throw new Error("Error obtaining quiz");
                } else {
                    console.log("grabbed quiz with id: " + res.data.uuid);

                    questions = res.data.questions;
                    quizID = res.data.uuid;

                    console.log(res.data);
                }
            }).catch((e: any) => console.log(e));
        }

        collectData().catch((e: any) => console.log(e));

    }, [])

    const startQuiz = () => {
        setHasQuizStarted(true);
        setNum(0);
    }

    const incrementQuestion = (id: number) => {
        let answers: any[] = [];

        questions[num].answers.map((a: any) => {
            if (a.id === id) {
                answers.push({
                    id: a.id,
                    selected: true
                });
            } else {
                answers.push({
                    id: a.id,
                    selected: false
                });
            }
        })

        userQuestions.push({
            id: questions[num].id,
            answers
        });

        if (num != questions.length - 1) {
            setNum(num + 1);
        } else {
            const cookies = new Cookies();
            let uuid = cookies.get('uuid');
            let token = cookies.get('token');

            questions = userQuestions;

            let data = {
                userId: uuid,
                token: token,
                quizId: quizID,
                questions
            }

            console.log(data);

            axios.post("/api/quiz/submit", data=data).then((res: AxiosResponse) => {
                console.log(JSON.stringify(res.data));

                setFinished(true);

                let expiry = new Date();
                expiry.setDate(expiry.getDate()+1);
                expiry.setHours(0);
                expiry.setMinutes(0);
                expiry.setSeconds(0);
                expiry.setMilliseconds(0);
                console.log(expiry);

                cookies.set('finishedQuiz', true, { path: '/' , expires: expiry});
                console.log(cookies.get('finishedQuiz'));

                setScore(res.data.score);

            }).catch((e: any) => console.log(e));
        }
    }

    const incrementQuestionMulti = () => {
        let answers: any[] = [];

        questions[num].answers.map((a: any, index: number) => {
            if (a.id === isChecked[index]) {
                answers.push({
                    id: a.id,
                    selected: true
                });
            } else {
                answers.push({
                    id: a.id,
                    selected: false
                });
            }
        })

        // I'm aware that this is duplicated, just couldn't be bothered to function it
        userQuestions.push({
            id: questions[num].id,
            answers
        });

        if (num != questions.length - 1) {
            setNum(num + 1);
        } else {
            const cookies = new Cookies();
            let uuid = cookies.get('uuid');
            let token = cookies.get('token');

            questions = userQuestions;

            let data = {
                userId: uuid,
                token: token,
                quizId: quizID,
                questions
            }

            console.log(data);

            axios.post("/api/quiz/submit", data=data).then((res: AxiosResponse) => {
                console.log(JSON.stringify(res.data));

                setFinished(true);

                let expiry = new Date();
                expiry.setDate(expiry.getDate()+1);
                expiry.setHours(0);
                expiry.setMinutes(0);
                expiry.setSeconds(0);
                expiry.setMilliseconds(0);
                console.log(expiry);

                cookies.set('finishedQuiz', true, { path: '/' , expires: expiry});
                console.log(cookies.get('finishedQuiz'));
                cookies.set('quizId', res.data.quizId, { path: '/' , expires: expiry});

                setScore(res.data.score);

            }).catch((e: any) => console.log(e));
        }
    }

    if (finished) {
        let url = 'https://twitter.com/intent/tweet?text=%23quizapp%20my%20score%20was%20' + score;

        return (
            <div id={'quiz'} className={'row justify-content-center'}>
                <Card className={"w-50 row justify-content-center align-items-center"}>
                    <Card.Body className={"w-50 row justify-content-center align-items-center"}>
                        <div className={'row justify-content-center'}>
                            <p className={'row justify-content-center'}>You have finished the quiz </p>
                            <p className={'row justify-content-center'}>Your score was: {score}</p>
                            <a href={url} className={'row justify-content-center'}>Tweet Score</a>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    if (questions && hasQuizStarted) {
        if (questions[num].multiAnswers === false) {
            return (
                <div id={'quiz'} className={'row justify-content-center'}>
                    <Card className={"w-50 row justify-content-center align-items-center"}>
                        <Card.Body className={"row justify-content-center align-items-center"}>
                            <p className={'row justify-content-center'}>Question Number: {num}</p>

                            <p className={'row justify-content-center pt-4'}>{questions[num].question}</p>

                            {
                                questions[num].answers.map((ans: any, index: number) => {
                                    return <Button onClick={() => incrementQuestion(ans.id)} key={index} className={'m-2'}>{ans.name}</Button>
                                })
                            }

                        </Card.Body>
                    </Card>
                </div>
            )
        } else {
            return (
                <div id={'quiz'}>
                    <Card className={"w-50 row justify-content-center align-items-center"}>
                        <Card.Body className={"row justify-content-center align-items-center"}>
                            <p className={'row justify-content-center'}>Question Number: {num}</p>

                            <p className={'row justify-content-center pt-4'}>{questions[num].question}</p>

                            {
                                questions[num].answers.map((ans: any, index: number) => {
                                    return <input type={'checkbox'} checked={isChecked[index]} key={index} className={'m-2'}>{ans.name}</input>
                                })
                            }

                            <Button onClick={() => incrementQuestionMulti()} className={'m-2'}>Submit</Button>

                        </Card.Body>
                    </Card>
                </div>
            )
        }
    }

    return (
        <div id={'quiz'} className={'row justify-content-center'}>
            <Card className={"w-50 row justify-content-center align-items-center"}>
                <Card.Body>
                    <div className={'row justify-content-center'}>
                        <Button onClick={startQuiz}>Start Quiz</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default UserQuiz;