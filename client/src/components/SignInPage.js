import React from "react";

const SignInPage = () => {
    return (
        <form className="container">
            <div className="card mb-3 mt-3 pt-1">
                <div className="card-header p-2 text-center"><h3>Sign In</h3></div>
                <div className="card-body">
                    <input type="hidden" id="Id" />
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Name">Name</label> */}
                        <input className="form-control form-control-sm py-2" type="text" placeholder="Full Name" id="Name" required />
                    </div>
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Location">Location</label> */}
                        <input className="form-control form-control-sm py-2" type="text" placeholder="Email" id="Email" required />
                    </div>
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Money">Money</label> */}
                        <input className="form-control form-control-sm py-2" type="text" placeholder="Username" id="Username" required />
                    </div>
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Money">Payment Method</label> */}
                        <input className="form-control form-control-sm py-2" type="text" placeholder="Password" id="Password" required />
                    </div>
                    <div className="form-group align-items-center row py-2 text-center">
                        <div className="col-12">
                            <button type="submit" className="btn btn-success m-auto col-6 form-control">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default SignInPage