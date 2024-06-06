import React, { useState, useEffect, Fragment, useContext } from "react";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import Select from 'react-select';

import AppContext from "../AppContext";
import ApiURL from "../api/ApiURL";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { userName } = useContext(AppContext);

    const [getMonthCategoryExpenses, setGetMonthCategoryExpenses] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);

    useEffect(() => {
        const getexpensesbymonthcategory = async () => {
            try {
                const response = await api.post("/api/getexpensesbymonthcategory", { userName });
                setGetMonthCategoryExpenses(response.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getexpensesbymonthcategory();
    }, []);

    const uniqueYears = [...new Set(getMonthCategoryExpenses.map(expense => expense.year))];
    const uniqueMonths = [...new Set(getMonthCategoryExpenses.map(expense => expense.month))];

    const handleYearChange = selectedOptions => {
        setSelectedYears(selectedOptions.map(option => option.value));
    };

    const handleMonthChange = selectedOptions => {
        setSelectedMonths(selectedOptions.map(option => option.value));
    };

    const filterExpenses = () => {
        return getMonthCategoryExpenses.filter(expense => {
            const yearMatch = selectedYears.length ? selectedYears.includes(expense.year) : true;
            const monthMatch = selectedMonths.length ? selectedMonths.includes(expense.month) : true;
            return yearMatch && monthMatch;
        });
    };

    const filteredExpenses = filterExpenses();

    const totalAmounts = filteredExpenses.map(expense => parseFloat(expense.amount));

    const minValue = Math.min(...totalAmounts);
    const maxValue = Math.max(...totalAmounts);

    function getColorGradient(value) {
        const minColor = [0, 255, 0];
        const maxColor = [255, 0, 0];
        const midColor = [
            minColor[0] + (maxColor[0] - minColor[0]) * (value - minValue) / (maxValue - minValue),
            minColor[1] + (maxColor[1] - minColor[1]) * (value - minValue) / (maxValue - minValue),
            minColor[2] + (maxColor[2] - minColor[2]) * (value - minValue) / (maxValue - minValue)
        ];
        return `rgba(${midColor.join(',')}, 0.9)`;
    }

    const categoryLabels = [];
    const categoryData = [];
    const backgroundColors = [];
    const borderColors = [];

    filteredExpenses.forEach(expense => {
        const { categoryname, amount } = expense;
        categoryLabels.push(categoryname);
        categoryData.push(parseFloat(amount));
        backgroundColors.push(getColorGradient(parseFloat(amount)));
        borderColors.push(`rgba(0, 0, 0, 1)`);
    });

    const BarChartDataByCategory = {
        labels: categoryLabels,
        datasets: [{
            label: "Expenses by Category",
            data: categoryData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        }]
    };

    const monthYearData = filteredExpenses.map(expense => {
        const { year, month, amount } = expense;
        return {
            label: `${month}-${year}`,
            amount: parseFloat(amount)
        };
    });

    const aggregatedData = {};

    monthYearData.forEach(data => {
        const { label, amount } = data;
        if (aggregatedData[label]) {
            aggregatedData[label] += amount;
        } else {
            aggregatedData[label] = amount;
        }
    });

    const uniqueLabels = Object.keys(aggregatedData);
    const aggregatedAmounts = Object.values(aggregatedData);

    const BarChartDataByMonthYear = {
        labels: uniqueLabels,
        datasets: [{
            label: "Expenses by Month-Year",
            data: aggregatedAmounts,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
        }]
    };

    const BarChartoptions = {};

    return (
        <Fragment>
            <div className="container my-2">
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h6 className="text-center mb-0">Expenses Insights</h6>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                            <Select
                                isMulti
                                options={uniqueYears.map(year => ({ value: year, label: year }))}
                                onChange={handleYearChange}
                                placeholder="Select Years"
                                className="me-2"
                            />
                            <Select
                                isMulti
                                options={uniqueMonths.map(month => ({ value: month, label: month }))}
                                onChange={handleMonthChange}
                                placeholder="Select Months"
                            />
                        </div>
                        <div className="parent-container" style={{ height: "500px" }}>
                            <div className="stretch-height py-2">
                                <Bar options={BarChartoptions} data={BarChartDataByCategory} />
                            </div>
                            <div className="stretch-height py-2">
                                <Bar options={BarChartoptions} data={BarChartDataByMonthYear} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Dashboard;
