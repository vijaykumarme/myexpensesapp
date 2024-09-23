import React from 'react';
import Select from 'react-select';

const YearMonthFilter = ({ uniqueYears, uniqueMonths, uniqueDays, handleYearChange, handleMonthChange, handleDayChange }) => {
  return (
    <div className="d-flex justify-content-between mb-3">
      {/* Year Filter */}
      <Select
        isMulti
        options={uniqueYears.map(year => ({ value: year, label: year }))}
        onChange={handleYearChange}
        placeholder="Years"
        className="me-2"
      />

      {/* Month Filter */}
      <Select
        isMulti
        options={uniqueMonths.map(month => ({ value: month, label: month }))}
        onChange={handleMonthChange}
        placeholder="Months"
        className="me-2"
      />

      {/* Day Filter */}
      <Select
        isMulti
        options={uniqueDays.map(day => ({ value: day, label: day }))}
        onChange={handleDayChange}
        placeholder="Days"
      />
    </div>
  );
};

export default YearMonthFilter;
