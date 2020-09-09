const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    let authHeader = req.headers.authorization;
    console.log("authHeader: ",authHeader);

    if (!authHeader) {
        res.status(403).json({
            message: "no token provided!"
        })
    }

    const token = authHeader.split()[0];
    console.log("token: ",token);
    let decodedToken;
    
    try {
        decodedToken = jwt.verify(token, "secretpass");
    } 
    catch (err) {
        res.status(500).json({
            message: err,
        });
    }
    if (!decodedToken) {
        res.status(401).json({
            message: "Unauthorized!"
        });
    }
    req.email = decodedToken.email;
    next()
}
