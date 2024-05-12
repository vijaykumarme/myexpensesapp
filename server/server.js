const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes

//get all the records
app.get("/getexpenses", async (req, res) => {
  try {
    const allexpenses = await pool.query(
      "select expenseid,Extract(Day from Date) as Date,Month,Year,c.Categoryname,Description,Place,Paymentmethod,Amount from expenses e inner join Category c on c.Categoryid = e.Categoryid order by Year desc,Month desc,date desc"
    );
    res.json(allexpenses.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a single record
app.get("/getexpense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //const query = `SELECT * FROM expenses WHERE ExpenseID=${id}`
    const expenses = await pool.query(
      `SELECT * FROM expenses WHERE ExpenseID=${id}`
    );
    res.json(expenses.rows[0]);
    //console.log(query)
  } catch (err) {
    console.log(err.message);
  }
});

//insert a expenses record
app.post("/createexpense", async (req, res) => {
  try {
    const createExpenses = await pool.query(
      "INSERT INTO expenses(userid,categoryid,amount,description,place,paymentmethod,month,year,date) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
      [
        req.body.userid,
        req.body.categoryName,
        req.body.Amount,
        req.body.description,
        req.body.Place,
        req.body.paymentMethod,
        req.body.currentMonth,
        req.body.currentYear,
        req.body.date,
      ]
    );
    res.json(createExpenses.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//get all categories
app.get("/categories", async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM Category");
    res.json(allCategories.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/editexpense/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  console.log(req.body)

  const editexpense = await pool.query(
    "UPDATE expenses set categoryid = $1,description = $2,place=$3,amount=$4,paymentmethod = $5,month=$6,year=$7,date=$8 where expenseid = $9",
    [
      req.body.categoryName,
      req.body.description,
      req.body.place,
      req.body.amount,
      req.body.paymentmethod,
      req.body.currentMonth,     
      req.body.currentYear,
      req.body.date,
      id
    ]
  );

  // res.json("Expense Record Updated Successfull")
  res.json("Updated Successfully")

});

app.delete("/deleteexpense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM expenses WHERE ExpenseID = $1", [id]);
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the record" });
  }
});

//Server Port
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
