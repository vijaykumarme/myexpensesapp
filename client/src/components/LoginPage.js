import React,{ useContext, useState} from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

//components
import AppContext from "../AppContext";
import api from "../api/ApiURL";

const LoginPage = () => {

    const {setIsAuthenticated} = useContext(AppContext);

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");

    const sumbitHandler = async(e) => {
        e.preventDefault();
        try {
            const body = {email,password}

            // const response = await fetch("http://mynewexpenses.xyz/api/auth/login",{
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify(body)
            // })

            const response = await api.post('/api/auth/login', body, {
                headers: { "Content-Type": "application/json" }
            });

            const parseRes = response.data;

            if(parseRes.token) {
                localStorage.setItem("token",parseRes.token)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logedin successfully",
                    showConfirmButton: false,
                    timer: 1500
                  });
                setIsAuthenticated(true); 
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Username or Password Incorrect",
                    showConfirmButton: false,
                    timer: 1500
                  });
                setIsAuthenticated(false);
            }
        } catch(err) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Server Error",
                showConfirmButton: false,
                timer: 1500
              });
            console.error(err.message)
        }
    }

    return (
        <form onSubmit={sumbitHandler} className="container">
            <div className="card mb-3 mt-3 pt-1" style={{"box-shadow": "4px 4px 8px rgba(0, 0, 0, 0.3)"}}>
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