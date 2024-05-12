import React, { Fragment,useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';


import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import Header from './components/Header';
import CreateExpenses from './components/CreateExpenses';
import SignInPage from './components/SignInPage';
import History from './components/History';
import Dashboard from './components/Dashboard';
import EditExpenses from './components/EditExpenses';
import AppContext from './AppContext';

function App() {

  const [allExpenses, setAllExpenses] = useState([])
  const [expensesid, setExpensesid] = useState("")
  const [editExpense, setEditExpense] = useState([])
  const [categories, setCategories] = useState([])

  return (
    <AppContext.Provider value={{allExpenses, setAllExpenses, expensesid, setExpensesid, editExpense, setEditExpense, categories, setCategories}}>
      <div className="Container">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/SigninPage" element={<SignInPage />} />
            <Route path="/CreateExpenses" element={<CreateExpenses />} />
            <Route path="/History" element={<History />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/editExpenses" element={<EditExpenses expensesid={expensesid} />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;
