import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

//components
import AppContext from "../AppContext";

const CreateExpenses = () => {

    const {userName} = useContext(AppContext)

    const NavigateTo = useNavigate();

    const [categories, setCategories] = useState([]);

    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [Place, setPlace] = useState("");
    const [Amount, SetAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [date, setDate] = useState("");



    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const allCategories = await axios.get("http://localhost:5000/categories")
                console.log(allCategories.data)
                setCategories(allCategories.data)
            }catch (err) {
                console.log(err.message)
            }
            
        }

        getAllCategories()
    },[])
    
    const formSubmitHandler = async (e) => {
        e.preventDefault();
        const dateObject = new Date(date)
        const currentDay = dateObject.getDate();
        const currentMonth = dateObject.getMonth()+1;
        const currentYear = dateObject.getFullYear();
        const userid = userName;
        try {
            const createExpenses = await axios.post("http://localhost:5000/createexpense",{
                userid,categoryName,Amount,description,Place,paymentMethod,currentMonth,currentYear,date
            })
            Swal.fire({
                title: "Created!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            NavigateTo("/")
        } catch(err) {
            Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                icon: "error"
              });
            NavigateTo("/")
        }

    }


    return (
        <form onSubmit={formSubmitHandler} className="container">
            <div className="card mb-3 mt-3 pt-1">
                <div className="card-header p-2 text-center"><h3>Create Expenses</h3></div>
                <div className="card-body">
                    <input type="hidden" id="Id" />
                    <div className="form-group">
                        {/* <label className="col-form-label col-form-label-sm mt-4" htmlFor="Category">Category</label> */}
                        <select onChange={e => setCategoryName(e.target.value)} className="form-control my-2 py-2" id="Category">
                            {categories.map((category) => (
                                <option key={category.categoryid} value={category.categoryid}>
                                    {category.categoryname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <input onChange={e => setDescription(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="description" id="description" required />
                    </div>
                    <div className="form-group">
                        <input onChange={e => setPlace(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="Place" id="Place" required />
                    </div>
                    <div className="form-group">
                        <input onChange={e => SetAmount(e.target.value)} className="form-control form-control-sm py-2" type="number" placeholder="Enter Amount" id="Amount" required />
                    </div>
                    <div className="form-group">
                        <input onChange={e => setPaymentMethod(e.target.value)} className="form-control form-control-sm py-2" type="text" placeholder="Payment Method" id="Paymentmethod" required />
                    </div>
                    <div className="form-group">
                        <input onChange={e => setDate(e.target.value)} className="form-control form-control-sm py-2" type="datetime-local" id="Date" required />
                    </div>
                    <div className="form-group align-items-center row py-2 text-center">
                        <div className="col-12">
                            <button type="submit" className="btn btn-success m-auto col-6 form-control">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateExpenses;
