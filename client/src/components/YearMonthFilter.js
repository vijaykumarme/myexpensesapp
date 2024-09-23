import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: '30px',  // Decrease the height
    fontSize: '0.8rem',  // Smaller font size
    margin: '0 5px',     // Small margin between filters
  }),
  multiValue: (provided) => ({
    ...provided,
    fontSize: '0.8rem',  // Smaller font size for selected items
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '0.8rem',  // Smaller placeholder font size
  }),
};

const YearMonthFilter = ({ uniqueYears, uniqueMonths, uniqueDays, handleYearChange, handleMonthChange, handleDayChange }) => {
  return (
    <div className="d-flex justify-content-between mb-3 flex-wrap">
      <Select
        isMulti
        options={uniqueYears.map(year => ({ value: year, label: year }))}
        onChange={handleYearChange}
        placeholder="Years"
        styles={customStyles}  // Apply custom styles
        className="me-2"
      />
      <Select
        isMulti
        options={uniqueMonths.map(month => ({ value: month, label: month }))}
        onChange={handleMonthChange}
        placeholder="Months"
        styles={customStyles}  // Apply custom styles
      />
      <Select
        isMulti
        options={uniqueDays.map(day => ({ value: day, label: day }))}
        onChange={handleDayChange}
        placeholder="Days"
        styles={customStyles}  // Apply custom styles
      />
    </div>
  );
};

export default YearMonthFilter;
