import React,{ useContext, useState} from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

//components
import AppContext from "../AppContext";

const LoginPage = () => {

    const {setIsAuthenticated} = useContext(AppContext);

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");

    const sumbitHandler = async(e) => {
        e.preventDefault();
        try {
            const body = {email,password}

            const response = await fetch("http://localhost:5000/auth/login",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            const parseRes = await response.json();

            if(parseRes.token) {
                localStorage.setItem("token",parseRes.token)
                setIsAuthenticated(true);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logedin successfully",
                    showConfirmButton: false,
                    timer: 1500
                  });
            } else {
                setIsAuthenticated(false);
            }
        } catch(err) {
            console.error(err.message)
        }
    }

    return (
        <form onSubmit={sumbitHandler} className="container">
            <div className="card mb-3 mt-3 pt-1">
                <div className="card-header p-2 text-center"><h3>Login</h3></div>
                <div className="card-body">
                    <input type="hidden" id="Id" />
                    <div className="form-group py-2">
                        <input onChange={e => setEmail(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="Email" id="email" required />
                    </div>
                    <div className="form-group py-2">
                        <input onChange={e => setPassword(e.target.value)} className="form-control form-control-sm py-2" type="password" placeholder="Password" id="Password" required />
                    </div>
                    <div className="form-group align-items-center row py-2 text-center">
                        <div className="col-12">
                            <button type="submit" className="btn btn-success m-auto col-6 form-control">Create</button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                    <Link to="/SigninPage">Register</Link>
                    <Link to="/" className="d-none">Forgot Password?</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default LoginPage