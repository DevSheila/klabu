const mysql =require('mysql');

// Mysql
const pool =mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
});



exports.view =(req,res)=>{

    res.render('auth/login');

    
}
exports.getLogin =(req,res)=>{
    res.render('auth/login'); 
}
exports.getSignup =(req,res)=>{
    res.render('auth/signup'); 
}

