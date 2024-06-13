import React, { useState, useEffect, useContext, Fragment } from "react";
import axios from "axios";
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import moment from 'moment';

//components
import AppContext from "../AppContext";
import api from "../api/ApiURL";

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const MonthNames = [
    { monthId: 1, monthName: 'Jan' },
    { monthId: 2, monthName: 'Feb' },
    { monthId: 3, monthName: 'Mar' },
    { monthId: 4, monthName: 'Apr' },
    { monthId: 5, monthName: 'May' },
    { monthId: 6, monthName: 'Jun' },
    { monthId: 7, monthName: 'Jul' },
    { monthId: 8, monthName: 'Aug' },
    { monthId: 9, monthName: 'Sep' },
    { monthId: 10, monthName: 'Oct' },
    { monthId: 11, monthName: 'Nov' },
    { monthId: 12, monthName: 'Dec' }
];

const Home = () => {
    const { setUsername } = useContext(AppContext);
    const { userName } = useContext(AppContext);
    const { setUseremail } = useContext(AppContext);
    const { useremail } = useContext(AppContext);

    const [getCurrentMonthExpenses, setGetCurrentMonthExpenes] = useState([]);
    const [getAllExpenses, setGetAllExpenses] = useState([]);
    const [getCurrentMonthIncome, setGetCurrentMonthIncome] = useState([]);

    const dateObject = new Date();
    const currentMonth = dateObject.getMonth() + 1;
    const currentYear = dateObject.getFullYear();
    const currentMonthName = MonthNames.find(month => month.monthId === currentMonth);

    // Fetching user data once when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/api/userdashboard/', {
                    headers: { token: localStorage.token }
                });
                const { username, useremail } = response.data;
                setUsername(username);
                setUseremail(useremail);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array, runs only once

    // Fetching expenses and income whenever useremail changes
    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                if (useremail) {
                    const responseMonthly = await axios.post("https://myexpenses.xyz/api/getcurrentmonthexpenses", { currentMonth, currentYear, useremail });
                    setGetCurrentMonthExpenes(responseMonthly.data);
                    const responseAll = await axios.post("https://myexpenses.xyz/api/getmonthexpenses", { useremail });
                    setGetAllExpenses(responseAll.data);
                    const getCurrentIncome = await axios.post("https://myexpenses.xyz/api/getmonthlyincome", { currentYear, currentMonth, useremail });
                    setGetCurrentMonthIncome(getCurrentIncome.data);
                }
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchFinancialData();
    }, [useremail]); // Depends on useremail

    // Calculate gradient color
    const calculateGradientColor = (amounts, maxAmount, minAmount) => {
        const ratio = (amounts - minAmount) / (maxAmount - minAmount);
        const r = Math.floor(255 * ratio); // Red component increases with ratio
        const g = Math.floor(255 * (1 - ratio)); // Green component decreases with ratio
        const b = 0; // Blue component is kept at 0 to maintain the red-green gradient
        return `rgba(${r}, ${g}, ${b}, 0.9)`; // Alpha value is 0.9 for semi-transparency
    };

    const categories = getCurrentMonthExpenses.map(item => item.categoryname);
    const amounts = getCurrentMonthExpenses.map(item => item.totalamount);
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);
    const TotalMonthAmount = amounts.reduce((total, amount) => total + parseFloat(amount), 0).toFixed(2);
    const backgroundColors = amounts.map(amount => calculateGradientColor(amount, maxAmount, minAmount));

    const pieChartData = {
        labels: categories,
        datasets: [
            {
                label: "Monthly Expenses",
                data: amounts,
                backgroundColor: backgroundColors,
                hoverOffset: 4,
            }
        ]
    };

    // Organize data for line chart
    const organizedData = {};
    getAllExpenses.forEach(expense => {
        const { date, month, year, categoryname, amount } = expense;
        const key = `${year}-${month}-${date}`; // Use a unique key for each date
        if (!organizedData[key]) {
            organizedData[key] = {};
        }
        if (!organizedData[key][categoryname]) {
            organizedData[key][categoryname] = amount;
        } else {
            organizedData[key][categoryname] += amount;
        }
    });

    const categorynames = Object.values(organizedData)
        .flatMap(entry => Object.keys(entry))
        .filter((value, index, self) => self.indexOf(value) === index);

    const labels = Object.keys(organizedData);

    const getRandomColor = () => {
        // Generate random RGB values
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        // Return color string in RGBA format
        return `rgba(${r},${g},${b},0.6)`;
    };

    let datasets = [];

    // Iterate over category names
    categorynames.forEach(type => {
        let data = [];

        // Iterate over dates
        Object.keys(organizedData).forEach(date => {
            // Check if the category type exists for the current date
            const value = organizedData[date][type] ? parseFloat(organizedData[date][type]) : 0;
            data.push(value);
        });

        // Push dataset object
        datasets.push({
            label: type,
            data: data,
            borderColor: getRandomColor() // Assigning different border color
        });
    });

    const generateLineChartData = {
        labels: labels,
        datasets: datasets.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
        }))
    };

    // Bar Chart data
    const dailyExpenses = {};
    getAllExpenses.forEach(expense => {
        const { date, amount } = expense;
        if (!dailyExpenses[date]) {
            dailyExpenses[date] = 0;
        }
        dailyExpenses[date] += parseFloat(amount);
    });

    const days = Object.keys(dailyExpenses).sort((a, b) => a - b);
    const dailyAmounts = days.map(day => dailyExpenses[day]);
    const maxDailyAmount = Math.max(...dailyAmounts);
    const minDailyAmount = Math.min(...dailyAmounts);
    const barChartColors = dailyAmounts.map(amount => calculateGradientColor(amount, maxDailyAmount, minDailyAmount));

    const barChartData = {
        labels: days,
        datasets: [
            {
                label: "Daily Expenses",
                data: dailyAmounts,
                backgroundColor: barChartColors,
                borderColor: barChartColors,
                borderWidth: 1,
            }
        ]
    };

    console.log("Current Month Expenses:", getCurrentMonthExpenses);

    return (
        <Fragment>
            <div className="container">
                <div className="card my-2">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0 text-center">Current Month Information</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-6 mb-3 mb-md-0">
                                <p className="p mb-0">Month: <span className="text-primary">{currentMonthName.monthName}</span></p>
                            </div>
                            <div className="col-12 col-md-6 text-md-right">
                                {getCurrentMonthIncome.amount && <p className="p mb-2 mb-md-0">Month Income: &#x20B9;<span className="text-success">{getCurrentMonthIncome.amount}</span></p>}
                                <p className="p mb-2 mb-md-0">Expenses: &#x20B9;<span className="text-danger">{TotalMonthAmount}</span></p>
                                {getCurrentMonthIncome.amount && <p className="p mb-0">Saving: &#x20B9;<span className="text-success">{getCurrentMonthIncome.amount - TotalMonthAmount}</span></p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card my-2">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0 text-center">Charts</h4>
                    </div>
                    <div id="carouselExampleControls" className="carousel slide py-2" data-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div>
                                    <Pie data={pieChartData} className="d-block h-100 w-100" alt="First slide" />
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="parent-container pt-4" style={{ height: "500px" }}>
                                    <Bar data={barChartData} className="d-block w-100" alt="Third slide" />
                                </div>
                            </div>
                            {/* <div className="carousel-item">
                                <div className="parent-container pt-4" style={{ height: "500px" }}>
                                    <Line data={forecastLineChartData} className="d-block w-100" alt="Forecast slide" />
                                </div>
                            </div> */}
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Home;
