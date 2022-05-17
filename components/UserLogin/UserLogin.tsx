import { Form, Button, Card, Alert } from "react-bootstrap";
import { SubmitHandler, useForm } from 'react-hook-form';
import { AxiosResponse } from "axios";
import { useState } from "react";
import { useRouter } from 'next/router';
const axios = require('axios');
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/w3.css';

interface IFormInput {
    email: string
    password: string
}

function UserLogin() {
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({mode: "onChange"});
    const router = useRouter();

    const onSubmit: SubmitHandler<IFormInput> =  (data: IFormInput) => {
        console.log(data.email, data.password);

        if (!data.email || !data.password) {
            setError("Please input into all fields");
            return;
        }

        axios.post("http://localhost:3000/api/user/login", {
            emailAddress: data.email,
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
                setError("Error with login");
            }
        }).catch((e: any) => console.log(e));
    };

    return(
        <div id={'login'} className={'row justify-content-center w3-panel w3-main'} >
            <Card className={"w-50 row justify-content-center align-items-center "}>
                <Card.Body>
                    <h2 className="text-center mb-4 ">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form action="" onSubmit={handleSubmit(onSubmit)}>

                        <Form.Group id="email">
                            <Form.Label>Email: </Form.Label>
                            <Form.Control type="email" {...register("email", {required: "This is required."})}
                                          placeholder="email"/>
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" {...register("password", {required: "This is required."})}
                                          placeholder="password"/>
                        </Form.Group>
                        <br></br>

                        <Button className="w-100" type="submit">
                            Login
                        </Button>
                    </form>
                </Card.Body>
            </Card>

            <a href={'../signup'}>
                <div className="w-100 text-center mt-2">
                    Haven't joined us? Create an account
                </div>
            </a>

        </div>
    )
}

export default UserLogin;