const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req,res,next) => {
    try {
        console.log(req.user)
        const jwtToken = req.header("token");
        if(!jwtToken) {
            return res.status(401).json("Not Authorize");
        }

        const payload = jwt.verify(jwtToken,process.env.jwtSecret);

        req.user = payload.user;

        next();
    } catch(err) {
        console.error(err.message);
        return res.status(401).json("Not Authorize")
    }
}