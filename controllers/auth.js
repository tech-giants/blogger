const session = require('express-session')
const connection = require('../models/db')

exports.login = (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    connection.query(
        'SELECT * FROM accounts WHERE username = ? AND password = ?',
        [username, password],
        (error, results) => {
            if (results.length > 0) {
                // console.log(results.id);
                
                req.session.loggedin = true;
				req.session.username = username;
                req.session.accountid = results[0].id
				res.redirect('/');
            } else {
                res.send('Incorrect password or username');
            }
        }
    );
}

exports.logout = (req, res) => {
    req.session.loggedin = false;
    req.session.username = null;
    res.redirect('/');
}
exports.signup = function(req, res){
   
    message = '';
    if(req.method == "POST"){
        var sql="select * from accounts where email = ? or username = ?"
        connection.query(sql,[req.body.email,req.body.username],function(err,result){
            if(result.length>=1){
                res.render('signup.ejs',{error:"email already exists",verified:""});
            }
            else{
                
                var post  = req.body;
                var name= post.username;
                var pass= post.password;
                var email= post.email;
           
                var sql = "INSERT INTO `accounts`(`username`,`password`,`email`) VALUES ('" + name + "','" + pass + "','" + email + "')";
           
                var query = connection.query(sql, function(err, result) {
           
                   message = "Succesfully! Your account has been created.";
                   res.redirect('/login');
                });
            }
        });
            
  
  
    } else {
        res.render('signup.ejs',{error:"",verified:""});
    }
 };