import React, { useContext, useState } from "react";
import axios from "axios";
import AppContext from "../AppContext";
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2';

const EditExpenses = () => {

    const navigateTo = useNavigate();

    const {editExpense} = useContext(AppContext);
    const {categories} = useContext(AppContext);
    const {setCategories} = useContext(AppContext)
    const {expensesid} = useContext(AppContext);

    const formattedDate = editExpense.date.slice(0, 16); // Truncate the string to remove milliseconds and time zone
    const category = categories.find(cat => cat.categoryid === editExpense.categoryid)
    
    console.log(category)


    const [categoryName, setCategoryName] = useState(category.categoryid);
    const [description, setDescription] = useState(editExpense.description);
    const [place, setPlace] = useState(editExpense.place);
    const [amount, SetAmount] = useState(editExpense.amount);
    const [paymentmethod, setPaymentMethod] = useState(editExpense.paymentmethod);
    const [date, setDate] = useState(formattedDate);
    //const formattedDate = editExpense.date.slice(0, 16); // Truncate the string to remove milliseconds and time zone
    //setDate(formattedDate);

    console.log("--------------------")

    console.log(description)
    console.log(place)
    console.log(amount)
    console.log(paymentmethod)
    console.log(date)
    console.log(categoryName)
    console.log(categoryName)

    const cancelUpdateHandler = () => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Update Cancelled",
            showConfirmButton: false,
            timer: 1500
          });
        navigateTo("/History")
    }

    const updateHandler = async (e) => {
        console.log("Expenseid: "+expensesid)
        console.log(categoryName)
        e.preventDefault();
        try {
            const dateObject = new Date(date);
            const currentMonth = dateObject.getMonth() + 1;
            const currentYear = dateObject.getFullYear();
    
            const response = await axios.put(`http://localhost:5000/editexpense/${expensesid}`, {
                categoryName,
                description,
                place,
                amount,
                paymentmethod,
                currentMonth,
                currentYear,
                date
            });

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Updated Successfully",
                showConfirmButton: false,
                timer: 1500
              });
              navigateTo("/History")
  
        } catch(err) {
            console.log(err.message);
            Swal.fire({
                position: "top-end",
                icon: "failed",
                title: "Updat Failed",
                showConfirmButton: false,
                timer: 1500
              });

        }
    }
    

    return (
        <form onSubmit={updateHandler} className="container">
            <div className="card mb-3 mt-3 pt-1">
                <div className="card-header p-2 text-center"><h3>Edit Expenses</h3></div>
                <div className="card-body">
                    <input type="hidden" id="Id" />
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Category">Category</label> */}
                        <select onChange={e => setCategoryName(e.target.value)} className="form-control my-2 py-2" id="Category">
                            {categories.map((category) => (
                                <option key={category.categoryid} value={category.categoryid} selected={category.categoryid === categoryName} >
                                    {category.categoryname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <input value={description}  onChange={e => setDescription(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="description" id="description" required />
                    </div>
                    <div className="form-group">
                        <input value={place} onChange={e => setPlace(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="place" id="place" required />
                    </div>
                    <div className="form-group">
                        <input value={amount} onChange={e => SetAmount(e.target.value)} className="form-control form-control-sm py-2" type="number" placeholder="Enter Amount" id="Amount" required />
                    </div>
                    <div className="form-group">
                        <input value={paymentmethod} onChange={e => setPaymentMethod(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="Payment Method" id="Paymentmethod" required />
                    </div>
                    <div className="form-group">
                        <input value={date} onChange={e => setDate(e.target.value)} className="form-control form-control-sm py-2" type="datetime-local" id="Date" required />
                    </div>
                    <div className="form-group align-items-center row py-2 text-center">
                        <div className="col-6 col-sm-6 col-xs-6"> {/* Corrected "col-sx-6" to "col-xs-6" */}
                            <button type="submit" className="btn btn-success m-auto form-control">Update</button>
                        </div>
                        <div className="col-6 col-sm-6 col-xs-6"> {/* Corrected "col-sx-6" to "col-xs-6" */}
                            <button onClick={cancelUpdateHandler} className="btn btn-success m-auto form-control">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EditExpenses;
