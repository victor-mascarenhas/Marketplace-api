const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg: "No token, authorization denied"});
    }
    try{
        const {user} = jwt.decode(token)
        const isPartner = user.partner
        if(isPartner){
            next()
        }else{
            return res.status(401).json({msg: "Autorização negada, o usuário não é um administrador"})
        }

        
    }catch(err){
        console.error("something wrong with partner middleware");
        res.status(500).json({msg: "Server Error"})
    }
}

