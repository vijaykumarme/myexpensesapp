import React, {useState, useEffect, useContext, Fragment} from "react";
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
    DecimationAlgorithm,
} from 'chart.js'
//import { Chart, ArcElement, Legend, Tooltip } from 'chart.js';
import moment from 'moment';

//components
import AppContext from "../AppContext";
import api from "../api/ApiURL";
import "./Home.css";



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

    const {setUsername} = useContext(AppContext)
    const {userName} = useContext(AppContext)
    const {setUseremail} = useContext(AppContext)
    const {useremail} = useContext(AppContext)
    const { currentDay } = useContext(AppContext);
    const { setCurrentDay } = useContext(AppContext);
    const { currentTimeInHours } = useContext(AppContext);
    const {setCurrentTimeInHours} = useContext(AppContext);
    const { setIsTodayRecordExists } = useContext(AppContext);
    const { isTodayRecordExists } = useContext(AppContext);

    const [getCurrentMonthExpenses, setGetCurrentMonthExpenes] = useState([]);
    const [getAllExpenses, setGetAllExpenses] = useState([])
    const [getCurrentMonthIncome, setGetCurrentMonthIncome] = useState([])


    const dateObject = new Date();
    const currentMonth = dateObject.getMonth()+1;
    const currentYear = dateObject.getFullYear();
    const currentMonthName = MonthNames.find(month => month.monthId === currentMonth)
    const currentDayVar = String(dateObject.getDate()).padStart(2, '0');
    const currentTimeInHoursVar = String(dateObject.getHours()).padStart(2, '0');

    setCurrentDay(currentDayVar);
    setCurrentTimeInHours(currentTimeInHoursVar);

    async function getCurrentMonthExpensesFunc () {
        try {
            const responsemonthly = await api.post("/api/getcurrentmonthexpenses",{currentMonth,currentYear,userName});
            setGetCurrentMonthExpenes(responsemonthly.data)
            const responseall = await api.post("/api/getmonthexpenses",{userName});
            setGetAllExpenses(responseall.data)
            const getcurrentincome = await api.post("/api/getmonthlyincome",{currentYear,currentMonth,useremail});
            setGetCurrentMonthIncome(getcurrentincome.data)
        } catch(err) {
            console.log(err.message)
        }
    }

    

    useEffect(() => {
      const currentDayRecord = getAllExpenses.filter(expense => expense.date === currentDay && expense.month === currentYear)
      if(currentDayRecord.length === 0 && currentTimeInHours > 10 &&!isTodayRecordExists) {
        setIsTodayRecordExists(true);
      }
      else {
        setIsTodayRecordExists(false);
      }
  
    },[])
    

    async function getName() {
        try {
            // const response = await fetch("http://mynewexpenses.xyz/api/userdashboard/",{
            //     method: "GET",
            //     headers: {token: localStorage.token}
            // })

            const response = await api.get('/api/userdashboard/', {
                headers: { token: localStorage.token }
            });


            const parseRes = response.data
            const currentUsername = parseRes.username
            const currentUserEmail = parseRes.useremail
            setUsername(currentUsername)
            setUseremail(currentUserEmail)
            
        } catch(err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getName();
    },[])

    useEffect(() => {
        getCurrentMonthExpensesFunc();
    },[userName])

    const calculateGradientColor = (amounts, maxAmount, minAmount) => {
        const ratio = (amounts - minAmount) / (maxAmount - minAmount);
        const r = Math.floor(255 * ratio); // Red component increases with ratio
        const g = Math.floor(255 * (1 - ratio)); // Green component decreases with ratio
        const b = 0; // Blue component is kept at 0 to maintain the red-green gradient
        return `rgba(${r}, ${g}, ${b}, 0.9)`; // Alpha value is 0.6 for semi-transparency
    };
    


    const categories = getCurrentMonthExpenses.map(item => item.categoryname);
    const amounts = getCurrentMonthExpenses.map(item => item.totalamount);

    const maxAmount = Math.max(...amounts)
    const minAmount = Math.min(...amounts)
    const TotalMonthAmount = amounts.reduce((total,amount) => total+parseFloat(amount),0).toFixed(2);

    const backgroundColors = amounts.map(amount => 
        calculateGradientColor(amount,maxAmount,minAmount)
    );

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
    }

    // LineChart ----------------------------------


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


    //Function to generate line chart data

    const categorynames = Object.values(organizedData)
        .flatMap(entry => Object.keys(entry))
        .filter((value, index, self) => self.indexOf(value) === index);

    const labels = Object.keys(organizedData)

    const getRandomColor = () => {
        // Generate random RGB values
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        // Return color string in RGBA format
        return `rgba(${r},${g},${b},0.6)`;
    };

    let datasets = [];

    // Iterate over meal types
    categorynames.forEach(type => {
      let data = [];

      // Iterate over dates
      Object.keys(organizedData).forEach(date => {
        // Check if the meal type exists for the current date
        const value = organizedData[date][type] ? parseFloat(organizedData[date][type]) : 0;
        data.push(value);
      });

      // Push dataset object
      datasets.push({
        label: type,
        data: data,
        borderColor: getRandomColor() // Assigning different border color for Breakfast and Lunch
      });
    });

    const generateLineChartData = {};
    generateLineChartData.labels = labels;
    generateLineChartData.datasets = datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor,
    }));

    //const options = {};

    // Bar Chart

    const filteredExpenses = getAllExpenses.filter(expense => expense.month === currentMonth);

    const dailyExpenses = {};
    filteredExpenses.forEach(expense => {
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

    const barChartColors = dailyAmounts.map(amount => 
        calculateGradientColor(amount, maxDailyAmount, minDailyAmount)
    );

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

    const barChartOptions = {
      scales: {
        x: {
            beginAtZero: true,
        },
        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return `₹${value}`;  // Adds the rupee symbol to the y-axis
                }
            }
        }
    },
      plugins: {
        legend: {
          display: false,  // This removes the legend
        },
      },
    };

    const maxAmountLineGraph = Math.max(...dailyAmounts);  // Find the highest amount

    const lineChartData = {
        labels: days,  // Use the same 'days' from the bar chart
        datasets: [
            {
                label: "Daily Expenses",
                data: dailyAmounts,  // Reuse the dailyAmounts
                fill: false,  // No fill under the line
                borderColor: 'rgba(75,192,192,1)',  // Line color
                tension: 0.1,  // Smooth curve
                pointBackgroundColor: dailyAmounts.map(amount => 
                    amount === maxAmountLineGraph ? 'red' : 'rgba(75,192,192,1)'
                ),  // Highlight the highest value with a red point
                pointBorderWidth: 2,
                pointRadius: dailyAmounts.map(amount => 
                    amount === maxAmountLineGraph ? 6 : 3  // Make the red point larger
                ),  // Increase size of the highest value dot
                borderWidth: 1,  // Decrease the width of the line
            }
        ]
    };
  

const lineChartOptions = {
  scales: {
      x: {
          beginAtZero: true,
      },
      y: {
          beginAtZero: true,
          ticks: {
              callback: function(value) {
                  return `₹${value}`;  // Adds the rupee symbol to the y-axis
              }
          }
      }
  },
  plugins: {
      legend: {
          display: false,
          position: 'top'
      }
  }
};


    return (
      <Fragment>
        <div className="container-fluid">
          <div className="main-content">
            <div className="container" style={{"box-shadow": "4px 4px 8px 2px rgba(0, 0, 0, 0.3)"}}>
              <div className="card my-2" style={{margin: "0 -15px"}}>
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
                    {getCurrentMonthIncome.amount && <p className="p mb-0">Saving: &#x20B9;<span className="text-success">{getCurrentMonthIncome.amount-TotalMonthAmount}</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card vh-100">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0 text-center">Charts</h4>
            </div>
            <div className="card-body">
              <div className="my-4 py-2 border border-2 rounded" style={{"box-shadow": "4px 4px 8px 2px rgba(0, 0, 0, 0.3)"}}>
                <h6 className="text-center" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.8rem', color: '#333', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 0', backgroundColor: '#f9f9f9', fontWeight: 'bold', borderRadius: '8px', boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)' }}>
                  Overview of This Month's Expenses
                </h6>
                <Line options={lineChartOptions} data={lineChartData} className="d-block" alt="Line chart" />
              </div>
              <div className="my-4 py-2 border border-2 rounded" style={{"box-shadow": "4px 4px 8px 2px rgba(0, 0, 0, 0.3)"}}>
                <h6 className="text-center" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.8rem', color: '#333', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 0', backgroundColor: '#f9f9f9', fontWeight: 'bold', borderRadius: '8px', boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)' }}>
                  Overview of This Month's Expenses
                </h6>
                <Pie data={pieChartData} className="" alt="First slide-lg" />
              </div>
              <div className="my-4 py-2 border border-2 rounded shadow-lg" style={{"box-shadow": "4px 4px 8px 2px rgba(0, 0, 0, 0.3)"}}>
              <h6 className="text-center"  style={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.8rem', color: '#333', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 0', backgroundColor: '#f9f9f9', fontWeight: 'bold', borderRadius: '8px', boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)' }}>This Month's Expenses by Day</h6>
                <Bar options={barChartOptions} data={barChartData} className="d-block" alt="second slide" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </Fragment>
    );
}

export default Home;
