import React from 'react';
import './CurrentMonthCard.css';

const CurrentMonthCard = ({
  totalSpent = 0,
  totalTransactions = 0,
  topCategory = 'Food',
  budgetLimit = 10000
}) => {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const budgetUsedPercent = Math.min((totalSpent / budgetLimit) * 100, 100).toFixed(0);
  const isOverBudget = totalSpent > budgetLimit;

  return (
    <div className="expense-card">
      <div className="header">
        <h2>{monthName} {year}</h2>
        <span className={`status ${isOverBudget ? 'over' : 'within'}`}>
          {isOverBudget ? 'Over Budget' : 'Within Budget'}
        </span>
      </div>

      <div className="amount">₹ {totalSpent.toFixed(2)}</div>

      <div className="details">
        <div>
          <p className="label">Transactions</p>
          <p className="value">{totalTransactions}</p>
        </div>
        <div>
          <p className="label">Top Category</p>
          <p className="value">{topCategory}</p>
        </div>
        <div>
          <p className="label">Budget</p>
          <p className="value">₹ {budgetLimit.toFixed(2)}</p>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="fill"
          style={{ width: `${budgetUsedPercent}%`, backgroundColor: isOverBudget ? '#ff4d4f' : '#4caf50' }}
        />
      </div>

      <p className="progress-label">{budgetUsedPercent}% of budget used</p>
    </div>
  );
};

export default CurrentMonthCard;
