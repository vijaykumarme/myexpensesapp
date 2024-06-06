import React, { Fragment,useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';


import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import Header from './components/Header';
import CreateExpenses from './components/CreateExpenses';
import SignInPage from './components/SignInPage';
import History from './components/History';
import Dashboard from './components/Dashboard';
import EditExpenses from './components/EditExpenses';
import AppContext from './AppContext';
import Home from './components/Home';
import Advance from './components/Advance';
import UserAllMonthsIncome from './components/UserAllMonthsIncome';
import api from './api/ApiURL';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allExpenses, setAllExpenses] = useState([])
  const [expensesid, setExpensesid] = useState("")
  const [editExpense, setEditExpense] = useState([])
  const [categories, setCategories] = useState([])
  const [userName, setUsername] = useState("");
  const [useremail,setUseremail] = useState("");

  async function isAuth() {
    try {
      // const response = await fetch("http://mynewexpenses.xyz/api/auth/is-verify",{
      //   method: "GET",
      //   headers: {token: localStorage.token}
      // })

      const response = await api.get('/api/auth/is-verify', {
        headers: { token: localStorage.token }
      });

      const parseRes = response.data

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false)


    } catch(err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  })


  return (
    <AppContext.Provider value={{ isAuthenticated,setIsAuthenticated,allExpenses, setAllExpenses, expensesid, setExpensesid, editExpense, setEditExpense, categories, setCategories, userName, setUsername, useremail,setUseremail}}>
      <Fragment>
      <div className="Container">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route exact path="/" element={isAuthenticated ? (<Home />) : (<Navigate to="/LoginPage" />) } />
            <Route path="/LoginPage" element={!isAuthenticated ? (<LoginPage />) : (<Navigate to="/" />)} />
            <Route path="/SigninPage" element={!isAuthenticated ? (<SignInPage />) : (<Navigate to="/" />)} />
            <Route path="/CreateExpenses" element={isAuthenticated ? (<CreateExpenses />) : (<Navigate to="/" />)} />
            <Route path="/History" element={isAuthenticated ? (<History />) : (<Navigate to="/" />)} />
            <Route path="/Dashboard" element={isAuthenticated ? (<Dashboard />) : (<Navigate to="/" />)} />
            <Route path="/Advance" element={isAuthenticated ? (<Advance />) : (<Navigate to="/" />)} />
            <Route path="/userMonthlyIncome" element={isAuthenticated ? (<UserAllMonthsIncome />) : (<Navigate to="/" />)} />
            <Route path="/editExpenses" element={isAuthenticated ? (<EditExpenses expensesid={expensesid} />) : (<Navigate to="/" />)} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
      </Fragment>
    </AppContext.Provider>
  );
}

export default App;
