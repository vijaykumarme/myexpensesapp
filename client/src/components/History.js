import React,{useState,useEffect,useContext} from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
import AppContext from "../AppContext";



const History = () => {

    const {allExpenses} = useContext(AppContext)
    const {setAllExpenses} = useContext(AppContext)
    const {setCategories} = useContext(AppContext)
    const {expensesid} = useContext(AppContext)
    const {setExpensesid} = useContext(AppContext)
    const {editExpense} = useContext(AppContext);
    const {setEditExpense} = useContext(AppContext);


    const navigateTo = useNavigate();

    //const [allExpenses, setAllExpenses] = useState([]);


    useEffect(() => {
        const getAllRecords = async () => {
            try {
                const response = await axios.get("http://localhost:5000/getexpenses");
                console.log(response.data)
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
            const response = await axios.get(`http://localhost:5000/getexpense/${expenseid}`)
            setEditExpense(response.data)
            const getcaregories = await axios.get("http://localhost:5000/categories")
            setCategories(getcaregories.data)
            navigateTo("/editExpenses")
        }catch(err) {
            console.log(err.message)
        }
    }
    console.log("Start")
    console.log(editExpense)
    console.log("End")

    const deleteExpensesHandler = (id) => {

        const deleteHandler = () => {
            try {
                const deleteExpenses = axios.delete(`http://localhost:5000/deleteExpense/${id}`)
                console.log(deleteExpenses.data)
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
              
            }
          });
          setAllExpenses(allExpenses.filter(allExpenses => allExpenses.expenseid !== id))
    }


    const [search, setSearch] = useState("")

    return(
        <div>
            <h3 className="text-center pt-2">History</h3>
            <form className="d-flex">
                <input onChange={e => setSearch(e.target.value)} className="form-control mt-3 mx-2" />
            </form>
            <table class="table table-striped table-dark table-bordered mt-3">
            <thead>
                <tr>
                <th scope="col">SI.NO</th>
                <th scope="col">Date</th>
                <th scope="col">Month</th>
                <th scope="col">Year</th>
                <th scope="col">Category</th>
                <th scope="col">Name</th>
                <th scope="col">Place</th>
                <th scope="col">Paymentmethod</th>
                <th scope="col">Amount</th>
                <th scope="col"></th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {allExpenses.filter((item) => {
                    return (
                        search.toLocaleLowerCase() === '' ? item : item.date.toString().toLocaleLowerCase().includes(search)||
                        search.toLocaleLowerCase() === '' ? item : item.month.toString().toLocaleLowerCase().includes(search)||
                        search.toLocaleLowerCase() === '' ? item : item.year.toString().toLocaleLowerCase().includes(search)||
                        search.toLocaleLowerCase() === '' ? item : item.description.toString().toLocaleLowerCase().includes(search)||
                        search.toLocaleLowerCase() === '' ? item : item.place.toString().toLocaleLowerCase().includes(search)||
                        search.toLocaleLowerCase() === '' ? item : item.paymentmethod.toString().toLocaleLowerCase().includes(search)||
                        search.toLocaleLowerCase() === '' ? item : item.amount.toString().toLocaleLowerCase().includes(search)

                );
                }).map((expense,index) => {
                    return(
                     <tr key={expense.expenseid}>
                     <th scope="row">{index+1}</th>
                     <td>{expense.date}</td>
                     <td>{expense.month}</td>
                     <td>{expense.year}</td>
                     <td>{expense.categoryname}</td>
                     <td>{expense.description}</td>
                     <td>{expense.place}</td>
                     <td>{expense.paymentmethod}</td>
                     <td>{expense.amount}</td>
                     <td><i onClick={() => editExpensesHandler(expense.expenseid)} class="fa-solid fa-pen-to-square" style={{cursor : 'pointer'}}></i></td>
                     <td><i onClick={() => deleteExpensesHandler(expense.expenseid)} class="fa-solid fa-trash" style={{cursor : 'pointer'}}></i></td>
                     </tr>
                    )
            })}
            </tbody>
        </table>
        </div>
    )
}

export default History