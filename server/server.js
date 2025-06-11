require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

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

//Get previous two months expenses
app.post("/api/recentMonthsSavings", async(req,res) => {
  try{
    const recentMonthsSavings = await pool.query("SELECT exp.year,exp.month,mi.amount AS monthly_income,SUM(exp.amount) AS total_expense FROM expenses AS exp LEFT JOIN monthlyincome AS mi ON mi.userid = exp.userid AND mi.year = exp.year AND mi.month = exp.month WHERE exp.userid = $1 AND DATE_TRUNC('month', MAKE_DATE(exp.year, exp.month, 1)) BETWEEN DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '2 months' AND DATE_TRUNC('month', CURRENT_DATE) GROUP BY exp.year, exp.month, mi.amount ORDER BY exp.year DESC, exp.month DESC;",[req.body.userId]);
    res.json(recentMonthsSavings.rows);
  }catch(err){
    console.error(err.message);
  }
})

//get all the records
app.post("/api/getexpenses", async (req, res) => {
  try {
    const allexpenses = await pool.query(
      "select expenseid,Extract(Day from Date) as Date,Month,Year,c.Categoryname,Description,Place,Paymentmethod,Amount from expenses e inner join Category c on c.Categoryid = e.Categoryid where userid = $1 order by Year desc,Month desc,date desc",[req.body.userId]
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
      "SELECT ROW_NUMBER() OVER (ORDER BY COUNT(description) DESC) AS id, categoryid,COUNT(categoryid) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY categoryid ORDER BY TotalCount DESC LIMIT 10",[req.body.userId]
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
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(description) DESC) AS id, description, COUNT(description) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY description ORDER BY TotalCount DESC Limit 15",[req.body.userId]
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
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(place) DESC) AS id, place, COUNT(place) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY place ORDER BY TotalCount DESC Limit 15",[req.body.userId]
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
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(amount) DESC) AS id, amount, COUNT(amount) AS TotalCount FROM expenses WHERE userid = $1  GROUP BY amount ORDER BY TotalCount DESC Limit 20",[req.body.userId]
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
      "SELECT DISTINCT ROW_NUMBER() OVER (ORDER BY COUNT(paymentmethod) DESC) AS id, paymentmethod, COUNT(paymentmethod) AS TotalCount FROM expenses WHERE userid = $1 GROUP BY paymentmethod ORDER BY TotalCount DESC Limit 10",[req.body.userId]
    );
    res.json(topUserPaymentMethods.rows);
  }catch(err){
    console.err(err.message)
  }
})

app.post("/api/getmonthexpenses", async (req, res) => {
  try {
    const allexpenses = await pool.query(
      "select expenseid,Extract(Day from Date) as Date,Month,Year,c.Categoryname,Description,Place,Paymentmethod,Amount from expenses e  inner join Category c on c.Categoryid = e.Categoryid  where userid = $1 order by Year desc,Month desc,date desc",[req.body.userId]
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
        req.body.userId,
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

//get all categories
app.get("/api/someCategories", async (req, res) => {
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
    const getcurrentmonthexpenses = await pool.query("select e.month,e.year,c.categoryname,sum(e.amount) as totalamount from expenses e inner join category c ON e.categoryid = c.categoryid where month = $1 and year = $2 and userid = $3 group by month,year,categoryname",[req.body.currentMonth,req.body.currentYear,req.body.userId]);
    res.json(getcurrentmonthexpenses.rows)
  } catch(err) {
    console.log(err.message)
  }
})

app.post("/api/getexpensesbymonthcategory", async(req,res) => {
  try {
    const getexpensesbymonthcategory = await pool.query("select e.year,e.month,c.categoryname,sum(e.amount) as Amount from expenses e inner join category c on e.categoryid = c.categoryid where userid = $1 group by e.year,e.month,c.categoryname order by e.year,e.month,c.categoryname;",[req.body.userId]);
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

    const incomeExists = await pool.query("SELECT * FROM monthlyincome WHERE year = $1 AND month = $2 AND userid = $3",[req.body.year, req.body.month, req.body.userId]);

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
    [req.body.currentYear,req.body.currentMonth,req.body.userId]);
    res.json(getmonthlyincome.rows[0])

  } catch(err) {
    console.error(err.message)
  }
})

app.post("/api/getallmonthsincome", async(req,res) => {
  try {
    const getallmonthsincome = await pool.query("SELECT * FROM monthlyincome WHERE userid = $1 order by year,month",
    [req.body.userId]
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

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

app.get("/Test", async(req,res) => {
  try{
    res.json("Working");
  } catch(err){
    console.error(err.message);
  }
})


// TaskTrek

// SIGN-UP
app.post("/TaskTrek/Signup", async (req, res) => {
  try {
    const { username, useremail, password } = req.body;
    if (!username || !useremail || !password)
      return res.status(400).json({ message: "Missing fields" });

    const checkUser = await pool.query(
      "SELECT 1 FROM tasktrekuser WHERE email = $1",
      [useremail]
    );
    if (checkUser.rows.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO tasktrekuser (username, email, password_hash)
       VALUES ($1,$2,$3)
       RETURNING id, username, email, created_at`,
      [username, useremail, password_hash]
    );

    res.status(201).json(result.rows[0]);           // {id,username,email,created_at}
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/TaskTrek/Login", async(req,res) => {
  try{
    const {useremail, password} = req.body

    //check user
    const user = await pool.query('SELECT * FROM tasktrekuser WHERE email = $1',[useremail])

    if(user.rows.length === 0){
      res.status(401).json({"message": "Invalid email or password"})
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash)

    if(!isMatch){
      res.status(401).json({"message": "Invalid email or password"})
    }

    res.status(201).json({"userid": user.rows[0].id,"useremal": user.rows[0].username, "password": user.rows[0].email})

  }catch(err){
    console.log(err.message);
  }
})

app.get("/TaskTrek/Tasks/:userid", async(req,res) => {
  try{
    const {userid} = req.params;

    const tasks = await pool.query('SELECT Id, user_id, title, description, created_at, started_at, completed_at, status from tasks where user_id = $1',[userid])

    res.status(200).json(tasks.rows)

  }catch(err){
    console.log(err.message)
  }
})

app.post("/TaskTrek/Create", async(req,res) => {
  try{
    const {userid, title, description,status} = req.body

    const task = await pool.query('INSERT INTO tasks (user_id, title, description,status) VALUES ($1,$2,$3,$4) RETURNING *',[userid, title, description,status])

    res.status(201).json(task.rows[0])

  }catch(err){
    console.log(err.message)
  }
})

app.delete("/TaskTrek/Delete/:id", async(req,res) => {
  try{
    const {id} = req.params;

    const task = await pool.query('Select id, title, description from tasks where id = $1',[id])

    if(task.rows.length === 0){
      res.status(401).json({"message": "task not found"})
    }

    await pool.query('DELETE FROM tasks where id = $1', [id]);

    res.status(200).json({"message": "Task deleted successfully"})

  }catch(err){
    console.log(err.message)
  }
})

// Server  Port 5000
app.listen(5000, () => {
  console.log("Server is starting on port 5000");
})
