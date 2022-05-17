import { Form, Button, Card, Alert } from "react-bootstrap";
import { SubmitHandler, useForm } from 'react-hook-form';
import { AxiosResponse } from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
const axios = require('axios');
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/w3.css';
import { validatePassword } from "../../utils/user";

interface IFormInput {
    name: string
    email: string
    password: string
    confirmPassword: string
}

function UserSignup() {
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({mode: "onChange"});
    const router = useRouter();

    const onSubmit: SubmitHandler<IFormInput> =  (data: IFormInput) => {
        console.log(data.name, data.email, data.password, data.confirmPassword);

        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            setError("Please input into all fields");
            return;
        }

        let isValidPassword = validatePassword(data.password);
        if (!isValidPassword) {
            setError("Invalid password");
            return;
        }

        if(data.password === data.confirmPassword){
            console.log("password confirmation successful");
        }
        else {
            console.log("passwords do not match");
            setError("Email or Password Incorrect");
        }

        axios.post("http://localhost:3000/api/user/create", {
            emailAddress: data.email,
            displayName: data.name,
            password: data.password
        }).then((res: AxiosResponse) => {
            if (res.status === 200) {
                const expiry = new Date(res.data.session.expiry);

                // Sets cookies
                const cookies = new Cookies();
                cookies.set('uuid', res.data.uuid, { path: '/' , expires: expiry});
                cookies.set('name', res.data.displayName, { path: '/' , expires: expiry});
                cookies.set('email', res.data.email, { path: '/' , expires: expiry});
                cookies.set('token', res.data.session.token, { path: '/' , expires: expiry});

                router.push('/').catch(e => console.log(e));

            } else {
                console.log('Error with creating user');
                setError("Error with creating user");
            }
        }).catch((e: any) => console.log(e));
    };

    return(
        <div id={'signup'} className={'row justify-content-center w3-panel w3-main'}>
            <Card className={"w-50 row justify-content-center align-items-center"}>
                <Card.Body>
                    <h2 className={"text-center mb-4"}>Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Form.Group id="name">
                            <Form.Label>Display Name: </Form.Label>
                            <Form.Control type={"text"} {...register("name", {required: "This is required."})}
                                          placeholder={"display name"}/>
                        </Form.Group>

                        <Form.Group id={"email"}>
                            <Form.Label>Email: </Form.Label>
                            <Form.Control type={"email"} {...register("email", {required: "This is required."})}
                                          placeholder={"email"}/>
                        </Form.Group>

                        <Form.Group id={"password"}>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type={"password"} {...register("password", {required: "This is required."})}
                                          placeholder={"password"}/>
                        </Form.Group>

                        <Form.Group id={"password-confirm"}>
                            <Form.Label>Password Confirmation: </Form.Label>
                            <Form.Control type={"password"} {...register("confirmPassword", {required: "This is required."})}
                                          placeholder={"confirm password"}/>
                        </Form.Group>
                        <br></br>

                        <div className={'row justify-content-center'}>
                            <Button className={"w-50"} type={"submit"}>
                                Sign Up
                            </Button>
                        </div>

                    </form>
                </Card.Body>
            </Card>

            <a href={'../login'}>
                <div className="w-100 text-center mt-2">
                    Already have an account? Login
                </div>
            </a>

        </div>
    )
}

export default UserSignup;