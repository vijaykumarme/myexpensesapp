import React from 'react';
import Select from 'react-select';

const YearMonthFilter = ({ uniqueYears, uniqueMonths, handleYearChange, handleMonthChange }) => {
  return (
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
  );
};

export default YearMonthFilter;
