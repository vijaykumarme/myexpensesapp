const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/",authorization,async(req,res) => {
    try {
        const user = await pool.query("SELECT userid,username,useremail FROM users WHERE userid = $1",
        [req.user])
        console.log(user.rows[0])
        res.json(user.rows[0])
    } catch(err){
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

module.exports = router;