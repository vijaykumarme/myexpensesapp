import React from "react";

const LoginPage = () => {
    return (
        <form className="container">
            <div className="card mb-3 mt-3 pt-1">
                <div className="card-header p-2 text-center"><h3>Login</h3></div>
                <div className="card-body">
                    <input type="hidden" id="Id" />
                    <div className="form-group py-4">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Money">Money</label> */}
                        <input className="form-control form-control-sm py-2" type="text" placeholder="Username" id="Username" required />
                    </div>
                    <div className="form-group py-2">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Money">Payment Method</label> */}
                        <input className="form-control form-control-sm py-2" type="text" placeholder="Password" id="Password" required />
                    </div>
                    <div className="form-group align-items-center row py-2 text-center">
                        <div className="col-12">
                            <button type="submit" className="btn btn-success m-auto col-6 form-control">Create</button>
                        </div>
                    </div>

                    <a to="/">Forgot Password?</a>
                </div>
            </div>
        </form>
    )
}

export default LoginPage