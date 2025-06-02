import React, { useState, useEffect, Fragment, useContext } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

// components
import AppContext from "../AppContext";
import api from "../api/ApiURL";

const UserAllMonthsIncome = () => {
    const { useremail, userId } = useContext(AppContext);

    const [monthlyIncome, setMonthlyIncome] = useState([]);

    console.log(useremail);

    async function getAllMonthsIncome() {
        try {
            const response = await api.post("/api/getallmonthsincome", { userId });
            setMonthlyIncome(response.data);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getAllMonthsIncome();
    }, []);

    console.log(monthlyIncome);

    const handleDelete = (incomeid) => {
        // Implement the delete functionality here
            const deletemonthincome = async() => {
                try {
                    const deleteIncome = await api.delete(`/api/deletemonthincome/${incomeid}`)
                } catch(err) {
                    console.error(err.message)
                }
            }
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    deletemonthincome()
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    setMonthlyIncome(monthlyIncome.filter(record => record.incomeid !== incomeid))
                }
              });
    };

    return (
        <Fragment>
            <div className="container mt-2">
                <h5 className="text-center">Monthly Income</h5>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Index</th>
                                <th scope="col">Month-Year</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyIncome.map((income, index) => (
                                <tr key={income.incomeid}>
                                    <td>{index + 1}</td>
                                    <td>{`${income.month}-${income.year.toString().slice(-2)}`}</td>
                                    <td>{income.amount}</td>
                                    <td>
                                        <button className="btn" onClick={() => handleDelete(income.incomeid)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
};

export default UserAllMonthsIncome;
