import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login(props) {
    const [loginForm, setloginForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function logMeIn(event) {
        axios({
            method: "POST",
            url: "/token",
            data: {
                email: loginForm.email,
                password: loginForm.password,
            },
        })
            .then((response) => {
                props.setToken(response.data.access_token);
                navigate("/MenuPage");
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });

        setloginForm({
            email: "",
            password: "",
        });

        event.preventDefault();
    }

    function handleChange(event) {
        const { value, name } = event.target;
        setloginForm((prevNote) => ({
            ...prevNote,
            [name]: value,
        }));
    }

    return (
        <div>
            <h1 id="title">Know Your Algo</h1>

            <div className="loginFrame">
                <p className="sign" align="center">
                    Sign in
                </p>

                <form className="login">
                    <input
                        className="un"
                        onChange={handleChange}
                        type="email"
                        text={loginForm.email}
                        name="email"
                        placeholder="Email"
                        value={loginForm.email}
                        align="center"
                    />

                    <input
                        className="pass"
                        onChange={handleChange}
                        type="password"
                        text={loginForm.password}
                        name="password"
                        placeholder="Password"
                        value={loginForm.password}
                        align="center"
                    />

                    <div className="submit-btn">
                        <button className="btn" onClick={logMeIn}>
                            Submit
                        </button>
                    </div>

                    <div className="suliRedirect">
                        <a href="/Signup">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
