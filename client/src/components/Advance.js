import React, { Fragment, useContext, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";

// Components
import AppContext from "../AppContext";
import api from "../api/ApiURL";

const Advance = () => {
    const { useremail } = useContext(AppContext);

    const [addCategory, setAddCategory] = useState(false);
    const [addMonthlyIncome, setAddMonthlyIncome] = useState(false);

    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [amount, SetAmount] = useState("");

    // State for Update Password
    const [updatePassword, setUpdatePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const openAddCategoryHandler = (e) => {
        e.preventDefault();
        setAddCategory(true);
        setAddMonthlyIncome(false);
        setUpdatePassword(false);
    };

    const cancelCategoryHandler = () => {
        setAddCategory(false);
    };

    const categorySubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/addCategory", { category });
            if (response.data !== 0) {
                setAddCategory(false);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Category added",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                setAddCategory(false);
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Failed to add category",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (err) {
            setAddCategory(false);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "An error occurred",
                text: err.message,
                showConfirmButton: true
            });
            console.error(err.message);
        }
    };

    const openAddMonthlyIncomeHandler = (e) => {
        e.preventDefault();
        setAddMonthlyIncome(true);
        setAddCategory(false);
        setUpdatePassword(false);
    };

    const cancelMonthlyIncomeHandler = () => {
        setAddMonthlyIncome(false);
    };

    const monthlyIncomeSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/addmonthlyincome", {
                year,
                month,
                amount,
                useremail
            });

            if (response.data !== 0) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Monthly income added",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Monthly income not added",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            setAddMonthlyIncome(false);
        } catch (err) {
            console.log(err.message);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Monthly income not added",
                showConfirmButton: false,
                timer: 1500
            });
        }
        setAddMonthlyIncome(false);
    };

    // Toggle Update Password Form
    const toggleUpdatePasswordHandler = (e) => {
        e.preventDefault();
        setUpdatePassword(true);
        setAddCategory(false);
        setAddMonthlyIncome(false);
    };

    // Submit Update Password
    const updatePasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put("/api/auth/update-password", {
                email: useremail,
                newPassword
            });

            if (response.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Password updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Failed to update password",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            setUpdatePassword(false);
        } catch (err) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "An error occurred",
                text: err.message,
                showConfirmButton: true
            });
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <div className="border border-dark rounded m-1">
                {!addCategory ? (
                    <div className="d-flex justify-content-between align-items-center my-2 px-2">
                        <h5 className="mb-0">Category</h5>
                        <span onClick={e => openAddCategoryHandler(e)} className="btn btn-primary">Add</span>
                    </div>
                ) : (
                    <div className="px-2 py-2">
                        <h5 className="px-1">Category</h5>
                        <form onSubmit={e => categorySubmitHandler(e)} className="form-control">
                            <div className="row">
                                <div className="col-12 my-1">
                                    <input onChange={e => setCategory(e.target.value)} type="text" placeholder="Enter new category" className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 my-1">
                                    <button type="submit" className="btn btn-primary btn-block form-control">Add</button>
                                </div>
                                <div className="col-6 my-1">
                                    <button onClick={cancelCategoryHandler} type="button" className="btn btn-secondary btn-block form-control">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="border border-dark rounded m-1">
                {!addMonthlyIncome ? (
                    <div className="d-flex justify-content-between align-items-center my-2 px-2">
                        <h5 className="mb-0">Monthly Income</h5>
                        <span onClick={e => openAddMonthlyIncomeHandler(e)} className="btn btn-primary">Add</span>
                    </div>
                ) : (
                    <div className="px-2 py-2">
                        <h5 className="px-1">Monthly Income</h5>
                        <form onSubmit={e => monthlyIncomeSubmitHandler(e)} className="form-control">
                            <div className="row">
                                <div className="col-12 my-1">
                                    <input onChange={e => setYear(e.target.value)} type="number" placeholder="(YYYY)Year" className="form-control" />
                                </div>
                                <div className="col-12 my-1">
                                    <input onChange={e => setMonth(e.target.value)} type="text" placeholder="(MM)Month" className="form-control" />
                                </div>
                                <div className="col-12 my-1">
                                    <input onChange={e => SetAmount(e.target.value)} type="text" placeholder="Amount" className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 my-1">
                                    <button type="submit" className="btn btn-primary btn-block form-control">Add</button>
                                </div>
                                <div className="col-6 my-1">
                                    <button onClick={cancelMonthlyIncomeHandler} type="button" className="btn btn-secondary btn-block form-control">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Update Password Section */}
            {/* <div className="border border-dark rounded m-1">
                {!updatePassword ? (
                    <div className="d-flex justify-content-between align-items-center my-2 px-2">
                        <h5 className="mb-0">Update Password</h5>
                        <span onClick={e => toggleUpdatePasswordHandler(e)} className="btn btn-primary">Update</span>
                    </div>
                ) : (
                    <div className="px-2 py-2">
                        <h5 className="px-1">Update Password</h5>
                        <form onSubmit={e => updatePasswordHandler(e)} className="form-control">
                            <div className="row">
                                <div className="col-12 my-1">
                                    <input onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New Password" className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 my-1">
                                    <button type="submit" className="btn btn-primary btn-block form-control">Update</button>
                                </div>
                                <div className="col-6 my-1">
                                    <button onClick={() => setUpdatePassword(false)} type="button" className="btn btn-secondary btn-block form-control">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div> */}

            <div className="border border-dark rounded m-1">
                <div className="d-flex justify-content-between align-items-center my-2 px-2">
                    <h5 className="mb-0">View Monthly Incomes</h5>
                    <Link to="/userMonthlyIncome" className="btn btn-primary">View</Link>
                </div>
            </div>
        </Fragment>
    );
};

export default Advance;
