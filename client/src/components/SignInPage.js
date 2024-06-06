import axios from "axios";
import React, { useContext, useState} from "react";
import { Link } from "react-router-dom";

//components
import AppContext from "../AppContext";
import api from "../api/ApiURL";

const SignInPage = () => {

    const {setIsAuthenticated} = useContext(AppContext);

    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const submitFormHandler = async(e) => {
        e.preventDefault();
        try {

            const body = {email,password,name}

            // const response = await fetch("http://localhost:5000/api/auth/register",{
            //     method: "POST",
            //     headers: { "Content-Type": "application/json"},
            //     body: JSON.stringify(body)
            // })

            const response = await api.post('/api/auth/register', body, {
                headers: { "Content-Type": "application/json" }
            });

            const parseRes = response.data;

            if(parseRes.token) {
                localStorage.setItem("token",parseRes.token)
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }

        } catch(err) {
            console.error(err.message)
        }

        setname("");
        setEmail("");
        setPassword("");
    }

    return (
        <form onSubmit={submitFormHandler} className="container">
            <div className="card mb-3 mt-3 pt-1">
                <div className="card-header p-2 text-center"><h3>Sign In</h3></div>
                <div className="card-body">
                    <input type="hidden" id="Id" />
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Money">Money</label> */}
                        <input onChange={e => setname(e.target.value)} className="form-control form-control-sm py-2" value={name} type="text" name="name" placeholder="Username" id="name" required />
                    </div>
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Location">Location</label> */}
                        <input onChange={e => setEmail(e.target.value)} className="form-control form-control-sm py-2" value={email} type="email" name="email" placeholder="Email" id="Email" required />
                    </div>
                    
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Money">Payment Method</label> */}
                        <input onChange={e => setPassword(e.target.value)} className="form-control form-control-sm py-2" value={password} type="password" name="password" placeholder="Password" id="Password" required />
                    </div>
                    <div className="form-group align-items-center row py-2 text-center">
                        <div className="col-12">
                            <button type="submit" className="btn btn-success m-auto col-6 form-control">Create</button>
                        </div>
                    </div>
                    <Link to="/LoginPage">Login</Link>
                </div>
            </div>
        </form>
    )
}

export default SignInPage