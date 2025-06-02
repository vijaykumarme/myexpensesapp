import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/ApiURL";
import AppContext from "../AppContext";

import "./CreateExpenses.css";
import axios from "axios";

const CreateExpenses = () => {
  const { userName } = useContext(AppContext);
  const { userId } = useContext(AppContext)

  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // This will store category name for display
  const [categoryId, setCategoryId] = useState(""); // This will store category ID to send in the request
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [topDescriptions, setTopDescriptions] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [topUserAmounts, setTopUserAmounts] = useState([]);
  const [topPaymentMethods, setTopPaymentMethods] = useState([]);

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data);
        console.log("Categories")
        console.log(response.data);
        const descriptionsResponse = await api.get("/api/someCategories")
        console.log("Descriptions")
        console.log(descriptionsResponse.data);
        console.log(userName);

      } catch (err) {
        console.log("Error fetching categories:", err.message);
      }
    };

    fetchCategories();
  }, []);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const dateObject = new Date(date);
    const currentMonth = dateObject.getMonth() + 1;
    const currentYear = dateObject.getFullYear();

    try {
      await api.post("/api/createexpense", {
        userId,
        categoryName: categoryId, // Send category ID
        Amount: parseFloat(amount),
        description: description.trim(),
        Place: place.trim(),
        paymentMethod: paymentMethod.trim(),
        currentMonth,
        currentYear,
        date,
      });

      Swal.fire("Created!", "Record created successfully.", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error!", "Failed to create record.", "error");
    }
  };

  const predefinedOptions = {
    1: categories.map((category) => ({
      id: category.categoryid,
      label: category.categoryname,
      onClick: () => {
        setCategoryName(category.categoryname); // Set the name for display
        setCategoryId(category.categoryid); // Set the ID to send in the request
      },
    })),
    2: [
      {
        id: 1,
        label: "Travel to Vijayawada",
        onClick: () => setDescription("Travel to Vijayawada"),
      },
      {
        id: 2,
        label: "Idli for lunch",
        onClick: () => setDescription("Idli for lunch"),
      },
      {
        id: 3,
        label: "Bought ice cream",
        onClick: () => setDescription("Bought ice cream"),
      },
    ],
    3: [
      { id: 1, label: "Kaptanupalem", onClick: () => setPlace("Kaptanupalem") },
      { id: 2, label: "Challapalli", onClick: () => setPlace("Challapalli") },
      { id: 3, label: "Vijayawada", onClick: () => setPlace("Vijayawada") },
    ],
    4: [
      { id: 1, label: "10", onClick: () => setAmount("10") },
      { id: 2, label: "20", onClick: () => setAmount("20") },
      { id: 3, label: "50", onClick: () => setAmount("50") },
      { id: 3, label: "100", onClick: () => setAmount("100") },
      { id: 3, label: "200", onClick: () => setAmount("200") },
      { id: 3, label: "500", onClick: () => setAmount("500") },
    ],
    5: [
      { id: 1, label: "Cash", onClick: () => setPaymentMethod("Cash") },
      { id: 2, label: "Card", onClick: () => setPaymentMethod("Card") },
      { id: 3, label: "UPI", onClick: () => setPaymentMethod("UPI") },
    ],
  };

  const renderPredefinedOptions = () => {
    const options = predefinedOptions[step] || [];
    const visibleOptions = showMore ? options : options.slice(0, 9); // Show up to 9 options initially

    return (
      <div className="options-container">
        {visibleOptions.map((option) => (
          <button
            key={option.id}
            className="btn btn-outline-primary m-2"
            onClick={option.onClick}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
        case 1:
  return (
    <div>
      <label
        className="bg-primary text-light"
        style={{ borderRadius: "3px", padding: "5px" }}
      >
        Category
      </label>
      <select
        className="form-control mt-2"
        value={categoryId}
        onChange={(e) => {
          const selectedCategoryId = e.target.value;
          const selectedCategory = categories.find(
            (category) => category.categoryid === selectedCategoryId
          );
          setCategoryId(selectedCategoryId); // Set the category ID
          setCategoryName(selectedCategory?.categoryname || ""); // Set the category name for display
        }}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((category) => (
          <option key={category.categoryid} value={category.categoryid}>
            {category.categoryname}
          </option>
        ))}
      </select>
      {renderPredefinedOptions()}
    </div>
  );

      case 2:
        return (
          <div>
            <label className="bg-primary text-light" style={{borderRadius: "3px", padding: "5px"}}>Description</label>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Select below names or enter name here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {renderPredefinedOptions()}
          </div>
        );
      case 3:
        return (
          <div>
            <label className="bg-primary text-light" style={{borderRadius: "3px", padding: "5px"}}>Place</label>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Select below places or enter place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            {renderPredefinedOptions()}
          </div>
        );
      case 4:
        return (
          <div>
            <label className="bg-primary text-light" style={{borderRadius: "3px", padding: "5px"}}>Amount</label>
            <input
              type="number"
              className="form-control mt-2"
              placeholder="Select below amounts or enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {renderPredefinedOptions()}
          </div>
        );
      case 5:
        return (
          <div>
            <label className="bg-primary text-light" style={{borderRadius: "3px", padding: "5px"}}>Payment Method</label>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Select below payments or enter payment type"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {renderPredefinedOptions()}
          </div>
        );
      case 6:
        return (
          <div>
            <label className="bg-primary text-light" style={{borderRadius: "3px", padding: "5px"}}>Date</label>
            <input
              type="datetime-local"
              className="form-control mt-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const steps = ["Category", "Description", "Place", "Amount", "Payment", "Date"];
  
    return (
      <div className="progress-container">
        {steps.map((stepLabel, index) => (
          <div key={index} className="progress-step">
            <div
              className={`circle ${step-1 > index ? "completed" : "upcoming"}`}
              style={{ position: "relative", display: "inline-block" }}
            />
            <span className="legend">{stepLabel}</span>
            {index < steps.length - 1 && (
              <div
                className={`line ${step-1 > index ? "completed" : "upcoming"}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-5">
      {renderProgressBar()}
      <div className="border rounded" style={{ minHeight: "300px", padding: "5px 10px 0 10px", }}>
        {renderStep()}
      </div>

      <div className="d-flex justify-content-between mt-3">
        {step > 1 && (
          <button
            className="btn btn-secondary"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {step < 6 ? (
  <button
    className="btn btn-primary ml-auto"
    onClick={() => setStep(step + 1)}
    disabled={
      (step === 1 && !categoryId) || // Check categoryId for Step 1
      (step === 2 && !description) ||
      (step === 3 && !place) ||
      (step === 4 && !amount) ||
      (step === 5 && !paymentMethod)
    }
  >
    Next
  </button>
) : (
  <button
    className="btn btn-success ml-auto"
    onClick={formSubmitHandler}
    disabled={!date}
  >
    Submit
  </button>
)}

      </div>
    </div>
  );
};

export default CreateExpenses;
