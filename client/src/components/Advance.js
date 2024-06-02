import React, { Fragment,useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Advance = () => {

    const [addCategory, setAddCategory] = useState(false)
    const [addMonthlyIncome, setAddMonthlyIncome] = useState(false)

    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [amount, SetAmount] = useState("");

    const openAddCategoryHandler = (e) => {
        e.preventDefault();
        setAddCategory(true);
        setAddMonthlyIncome(false)
    }

    const cancelCategoryHandler = () => {
        setAddCategory(false);
    }

    const categorySumitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/addCategory", { category });
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
            console.log(response.data);
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
        setAddCategory(false)
    }

    const cancelMonthlyIncomeHandler = () => {
        setAddMonthlyIncome(false);
    }

    const MonthlyIncomeSumitHandler = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/addmonthlyincome",
                {year,month,amount}
            );

            if(response.data !== 0) {
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
            setAddMonthlyIncome(false)
        } catch(err) {
            console.log(err.message)
            }
        setAddMonthlyIncome(false);
    }

    return(
        <Fragment>
            <div className="border border-dark rounded m-1">
                {!addCategory ? (
                    <div className="d-flex justify-content-between align-items-center my-2 px-2">
                        <h5 className="mb-0">Category</h5>
                        <span onClick={e => openAddCategoryHandler(e)} className="btn btn-primary">Add</span>
                    </div>
                ): (
                    <div className="px-2 py-2">
                    <h5 className="px-1">Category</h5>
                    <form onSubmit={e => categorySumitHandler(e)} className="form-control">
                        <div className="row">
                            <div className="col-12 my-1">
                                <input onChange={e => setCategory(e.target.value)} type="text" name="text" placeholder="Category" className="form-control" />
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
                ): (
                    <div className="px-2 py-2">
                    <h5 className="px-1">Monthly Income</h5>
                    <form onSubmit={e => MonthlyIncomeSumitHandler(e)} className="form-control">
                        <div className="row">
                            <div className="col-4 my-1">
                                <input onChange={e => setYear(e.target.value)} type="number" name="year" placeholder="year" className="form-control" />
                            </div>
                            <div className="col-4 my-1">
                                <input onChange={e => setMonth(e.target.value)} type="text" name="month" placeholder="month" className="form-control" />
                            </div>
                            <div className="col-4 my-1">
                                <input onChange={e => SetAmount(e.target.value)} type="text" name="amount" placeholder="amount" className="form-control" />
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
            <div className="border border-dark rounded m-1">
                <h5 className="my-1 p-2">View Monthly Income vs Expenses</h5>
            </div>
        </Fragment>
    )
}

export default Advance