import React,{useState,useEffect,useContext, Fragment} from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
import AppContext from "../AppContext";

import "./History.css"



const History = () => {

    const {userName} = useContext(AppContext)

    const {allExpenses} = useContext(AppContext)
    const {setAllExpenses} = useContext(AppContext)
    const {setCategories} = useContext(AppContext)
    const {expensesid} = useContext(AppContext)
    const {setExpensesid} = useContext(AppContext)
    const {editExpense} = useContext(AppContext);
    const {setEditExpense} = useContext(AppContext);


    const navigateTo = useNavigate();

    useEffect(() => {
        const getAllRecords = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/getexpenses",{userName});
                setAllExpenses(response.data)
            }catch(err) {
                console.log(err.message)
            }
        }
        getAllRecords()
    },[])

    const editExpensesHandler = async (expenseid) => {
        setExpensesid(expenseid)
        try {
            const response = await axios.get(`http://localhost:5000/api/getexpense/${expenseid}`)
            setEditExpense(response.data)
            const getcaregories = await axios.get("http://localhost:5000/api/categories")
            setCategories(getcaregories.data)
            navigateTo("/editExpenses")
        }catch(err) {
            console.log(err.message)
        }
    }

    const deleteExpensesHandler = (id) => {

        const deleteHandler = () => {
            try {
                const deleteExpenses = axios.delete(`http://localhost:5000/api/deleteExpense/${id}`)
            } catch(err) {
                console.log(err.message)
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
                deleteHandler()
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
              setAllExpenses(allExpenses.filter(allExpenses => allExpenses.expenseid !== id))
            }
          });
          
    }

    const [search, setSearch] = useState("")

    return(
        <Fragment>
            <div className="container">
                <h3 className="text-center pt-2">History</h3>
                <form className="d-flex">
                    <input onChange={e => setSearch(e.target.value)} className="form-control mt-3 mx-2 responsive-font" />
                </form>
                <div className="table-responsive">
                    <table className="table table-striped table-dark table-bordered mt-3 small">
                        <thead>
                            <tr>
                                <th scope="col" className="responsive-font">SI.NO</th>
                                <th scope="col" className="responsive-font">Date</th>
                                <th scope="col" className="responsive-font">Category</th>
                                <th scope="col" className="responsive-font">Name</th>
                                <th scope="col" className="responsive-font">Place</th>
                                <th scope="col" className="responsive-font">Payment Method</th>
                                <th scope="col" className="responsive-font">Amount</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allExpenses.filter((item) => {
                                return (
                                    search.toLocaleLowerCase() === '' ? item : item.date.toString().toLocaleLowerCase().includes(search) ||
                                    search.toLocaleLowerCase() === '' ? item : item.month.toString().toLocaleLowerCase().includes(search) ||
                                    search.toLocaleLowerCase() === '' ? item : item.year.toString().toLocaleLowerCase().includes(search) ||
                                    search.toLocaleLowerCase() === '' ? item : item.description.toString().toLocaleLowerCase().includes(search) ||
                                    search.toLocaleLowerCase() === '' ? item : item.place.toString().toLocaleLowerCase().includes(search) ||
                                    search.toLocaleLowerCase() === '' ? item : item.paymentmethod.toString().toLocaleLowerCase().includes(search) ||
                                    search.toLocaleLowerCase() === '' ? item : item.amount.toString().toLocaleLowerCase().includes(search)
                                );
                            }).map((expense, index) => {
                                return (
                                    <tr key={expense.expenseid}>
                                        <th scope="row" className="responsive-font">{index + 1}</th>
                                        <td className="text-nowrap responsive-font">{`${expense.date}-${expense.month}-${expense.year}`}</td>
                                        <td className="responsive-font">{expense.categoryname}</td>
                                        <td className="responsive-font">{expense.description}</td>
                                        <td className="responsive-font">{expense.place}</td>
                                        <td className="responsive-font">{expense.paymentmethod}</td>
                                        <td className="responsive-font">{expense.amount}</td>
                                        <td className="responsive-font"><i onClick={() => editExpensesHandler(expense.expenseid)} className="fa-solid fa-pen-to-square" style={{ cursor: 'pointer' }}></i></td>
                                        <td className="responsive-font"><i onClick={() => deleteExpensesHandler(expense.expenseid)} className="fa-solid fa-trash" style={{ cursor: 'pointer' }}></i></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>


    )
}

export default History