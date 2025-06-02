import React, { useState, useEffect, useContext, Fragment } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AppContext from "../AppContext";

// components
import "./History.css";
import api from "../api/ApiURL";
import YearMonthFilter from './YearMonthFilter';  // Import the filter component

const History = () => {
    const { userName } = useContext(AppContext);
    const { userId } = useContext(AppContext);

    const { allExpenses, setAllExpenses, setCategories, setExpensesid, editExpense, setEditExpense } = useContext(AppContext);

    const navigateTo = useNavigate();

    useEffect(() => {
        const getAllRecords = async () => {
            try {
                const response = await api.post("/api/getexpenses", { userId });
                setAllExpenses(response.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getAllRecords();
    }, [userName, setAllExpenses]);

    const editExpensesHandler = async (expenseid) => {
        setExpensesid(expenseid);
        try {
            const response = await api.get(`/api/getexpense/${expenseid}`);
            setEditExpense(response.data);
            const getCategories = await api.get("/api/categories");
            setCategories(getCategories.data);
            navigateTo("/editExpenses");
        } catch (err) {
            console.log(err.message);
        }
    };

    const deleteExpensesHandler = (id) => {
        const deleteHandler = () => {
            try {
                api.delete(`/api/deleteExpense/${id}`);
            } catch (err) {
                console.log(err.message);
            }
        };
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
                deleteHandler();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                setAllExpenses(allExpenses.filter(allExpenses => allExpenses.expenseid !== id));
            }
        });
    };
    
    const uniqueDays = [...new Set(allExpenses.map(expense => expense.date))].sort((a, b) => a - b);

    // Search Filters
    const [search, setSearch] = useState("");
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);  // New state for day selection

    // Year, Month, Day Handlers
    const handleYearChange = (selectedOptions) => {
        setSelectedYears(selectedOptions.map(option => option.value));
    };

    const handleMonthChange = (selectedOptions) => {
        setSelectedMonths(selectedOptions.map(option => option.value));
    };

    const handleDayChange = (selectedOptions) => {
        setSelectedDays(selectedOptions.map(option => option.value));  // New handler for days
    };

    // Filter Year, Month, and Day with uppercase transformation for search
    const filteredExpenses = allExpenses.filter((item) => {
        const searchUpper = search.toUpperCase(); // Convert input to uppercase

        const matchesSearch = searchUpper === '' ||
            item.date.toString().toUpperCase().includes(searchUpper) ||
            item.month.toString().toUpperCase().includes(searchUpper) ||
            item.year.toString().toUpperCase().includes(searchUpper) ||
            item.description.toUpperCase().includes(searchUpper) || // Convert item fields to uppercase
            item.place.toUpperCase().includes(searchUpper) ||
            item.paymentmethod.toUpperCase().includes(searchUpper) ||
            item.amount.toString().toUpperCase().includes(searchUpper);

        const matchesYear = selectedYears.length === 0 || selectedYears.includes(item.year);
        const matchesMonth = selectedMonths.length === 0 || selectedMonths.includes(item.month);
        const matchesDay = selectedDays.length === 0 || selectedDays.includes(item.date);  // Filter by day

        return matchesSearch && matchesYear && matchesMonth && matchesDay;
    });

    return (
        <Fragment>
            <div className="container">
                <h3 className="text-center pt-2">History</h3>

                {/* Year, Month, and Day Filter */}
                <YearMonthFilter 
                    uniqueYears={[...new Set(allExpenses.map(expense => expense.year))]} 
                    uniqueMonths={[...new Set(allExpenses.map(expense => expense.month))]} 
                    uniqueDays={uniqueDays}  // Add this line
                    handleYearChange={handleYearChange} 
                    handleMonthChange={handleMonthChange} 
                    handleDayChange={handleDayChange} 
                />

                <form className="d-flex">
                    <input
                        onChange={e => setSearch(e.target.value)} 
                        className="form-control mt-3 mx-2 responsive-font"
                        placeholder="Search..."
                    />
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
                            {filteredExpenses.map((expense, index) => (
                                <tr key={expense.expenseid}>
                                    <th scope="row" className="responsive-font">{index + 1}</th>
                                    <td className="text-nowrap responsive-font">{`${expense.date}-${expense.month}-${expense.year}`}</td>
                                    <td className="responsive-font">{expense.categoryname}</td>
                                    <td className="responsive-font">{expense.description}</td>
                                    <td className="responsive-font">{expense.place}</td>
                                    <td className="responsive-font">{expense.paymentmethod}</td>
                                    <td className="responsive-font">{expense.amount}</td>
                                    <td className="responsive-font">
                                        <i onClick={() => editExpensesHandler(expense.expenseid)} className="fa-solid fa-pen-to-square" style={{ cursor: 'pointer' }}></i>
                                    </td>
                                    <td className="responsive-font">
                                        <i onClick={() => deleteExpensesHandler(expense.expenseid)} className="fa-solid fa-trash" style={{ cursor: 'pointer' }}></i>
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

export default History;
