require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization,token'
}));

app.options('*', cors());

// app.use(cors({
//   origin: '*',
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }));
//app.use(cors());

//Routes

//register and login routes
app.use("/api/auth",require("./routes/jwtAuth.js"))

//dashboard
app.use("/api/userdashboard",require("./routes/userdashboard.js"))


//get all the records
app.post("/api/getexpenses", async (req, res) => {
  try {
    const allexpenses = await pool.query(
      "select expenseid,Extract(Day from Date) as Date,Month,Year,c.Categoryname,Description,Place,Paymentmethod,Amount from expenses e inner join Category c on c.Categoryid = e.Categoryid where userid = $1 order by Year desc,Month desc,date desc",[req.body.userName]
    );
    res.json(allexpenses.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all the categories of the user
app.post("/api/gettopusercategories", async(req,res) => {
  try{
    const topUserCategories = await pool.query(
      "SELECT ROW_NUMBER() OVER (ORDER BY COUNT(description) DESC) AS id, categoryid,COUNT(categoryid) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY categoryid ORDER BY TotalCount DESC LIMIT 10",[req.body.userName]
    );
    res.json(topUserCategories.rows);
  }catch(err){
    console.error(err.message)
  }
})

//get top 15 descriptions of the users
app.post("/api/gettopuserdescriptions", async(req,res) => {
  try {
    const topUserDescriptions = await pool.query(
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(description) DESC) AS id, description, COUNT(description) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY description ORDER BY TotalCount DESC Limit 15;",[req.body.userName]
    );
    res.json(topUserDescriptions.rows);
  }catch(err) {
    console.error(err.message)
  }
})

//get top 15 place of the users
app.post("/api/gettopuserplaces", async(req,res) => {
  try{
    const topUserPlaces = await pool.query(
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(place) DESC) AS id, place, COUNT(place) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY place ORDER BY TotalCount DESC Limit 15",[req.body.userName]
    );
    res.json(topUserPlaces.rows);
  }catch(err){
    console.error(err.message)
  }
})

//get top 20 amounts of the users
app.post("/api/gettopuseramonuts", async(req,res) => {
  try {
    const topUserAmounuts = await pool.query(
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(amount) DESC) AS id, amount, COUNT(amount) AS TotalCount FROM expenses WHERE userid = $1  GROUP BY amount ORDER BY TotalCount DESC Limit 20",[req.body.userName]
    );
    res.json(topUserAmounuts.rows);
  }catch(err){
    console.log(err.message);
  }
})

//get top 10 paymeny methods of the users
app.post("/api/gettopuserpaymentmethods", async(req,res) => {
  try{
    const topUserPaymentMethods = await pool.query(
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(paymentmethod) DESC) AS id, paymentmethod, COUNT(paymentmethod) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY paymentmethod ORDER BY TotalCount DESC Limit 10",[req.body.userName]
    );
    res.json(topUserPaymentMethods.rows);
  }catch(err){
    console.err(err.message)
  }
})

app.post("/api/getmonthexpenses", async (req, res) => {
  try {
    const allexpenses = await pool.query(
      "select expenseid,Extract(Day from Date) as Date,Month,Year,c.Categoryname,Description,Place,Paymentmethod,Amount from expenses e  inner join Category c on c.Categoryid = e.Categoryid  where userid = $1 order by Year desc,Month desc,date desc",[req.body.userName]
    );
    res.json(allexpenses.rows);
  } catch (err) {
    console.error(err.message);
  }
});


//get a single record
app.get("/api/getexpense/:id", async (req, res) => {
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
app.post("/api/createexpense", async (req, res) => {
  try {
    const createExpenses = await pool.query(
      "INSERT INTO expenses (userid,categoryid,amount,description,place,paymentmethod,month,year,date) VALUES ($1,$2, $3, $4,$5,$6,$7,$8,$9) returning *",
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
    ]);
    res.json(createExpenses.rows[0]);

  } catch (err) {
    console.log(err.message);
  }
});

//get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM Category");
    res.json(allCategories.rows);
  } catch (err) {
    console.log(err.message);
  }
});


//update the expense record
app.put("/api/editexpense/:id", async (req, res) => {
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

//delete the record
app.delete("/api/deleteexpense/:id", async (req, res) => {
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

//get all the expenses for current month
app.post("/api/getcurrentmonthexpenses", async(req,res) => {
  try {
    const getcurrentmonthexpenses = await pool.query("select e.month,e.year,c.categoryname,sum(e.amount) as totalamount from expenses e inner join category c ON e.categoryid = c.categoryid where month = $1 and year = $2 and userid = $3 group by month,year,categoryname",[req.body.currentMonth,req.body.currentYear,req.body.userName]);
    res.json(getcurrentmonthexpenses.rows)
  } catch(err) {
    console.log(err.message)
  }
})

app.post("/api/getexpensesbymonthcategory", async(req,res) => {
  try {
    const getexpensesbymonthcategory = await pool.query("select e.year,e.month,c.categoryname,sum(e.amount) as Amount from expenses e inner join category c on e.categoryid = c.categoryid where userid = $1 group by e.year,e.month,c.categoryname order by e.year,e.month,c.categoryname;",[req.body.userName]);
    res.json(getexpensesbymonthcategory.rows)
  } catch(err) {
    console.log(err.message) 
  }
})

//add category
app.post("/api/addCategory", async(req,res) => {
  try {
    const addCategory = await pool.query("INSERT INTO category (categoryname) values ($1) returning *",
  [req.body.category]);
    res.json(addCategory.rows[0])
  } catch(err) {
    console.error(err.message)
  }
})

//add month income
app.post("/api/addmonthlyincome", async(req,res) => {
  try{

    const incomeExists = await pool.query("SELECT * FROM monthlyincome WHERE year = $1 AND month = $2 AND userid = $3",[req.body.year, req.body.month, req.body.useremail]);

    if(incomeExists.rows.length !== 0) {
      return res.status(401).json("Record already exists")
    }

    const addmonthlyincome = await pool.query(
        "INSERT INTO monthlyincome (year, month, amount, userid) VALUES ($1, $2, $3, $4) RETURNING *",
        [
            req.body.year,
            req.body.month,
            req.body.amount,
            req.body.useremail
        ]
    );
  
  res.json(addmonthlyincome.rows[0]);
  } catch(err) {
    console.error(err.message)
  }
})

app.post("/api/getmonthlyincome", async(req,res) => {
  try {
    const getmonthlyincome = await pool.query("SELECT * FROM monthlyincome where year = $1 AND month = $2 and userid = $3",
    [req.body.currentYear,req.body.currentMonth,req.body.useremail]);
    res.json(getmonthlyincome.rows[0])

  } catch(err) {
    console.error(err.message)
  }
})

app.post("/api/getallmonthsincome", async(req,res) => {
  try {
    const getallmonthsincome = await pool.query("SELECT * FROM monthlyincome WHERE userid = $1 order by year,month",
    [req.body.useremail]
    )

    res.json(getallmonthsincome.rows)
  } catch(err) {
    console.error(err.message)
  }
})

app.delete("/api/deletemonthincome/:id", async(req,res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM monthlyincome WHERE incomeid = $1",[id]);
    res.json({ message: "Record deleted successfully"});
  } catch(err) {
    console.error(err.message)
    res.status(500).json({error: "An error occured while deleting the record"})
  }
})


//Server Port
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
