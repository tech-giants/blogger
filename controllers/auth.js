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
                req.session.loggedin = true;
				req.session.username = username;
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
       var post  = req.body;
       var name= post.username;
       var pass= post.password;
       var email= post.email;
  
       var sql = "INSERT INTO `accounts`(`username`,`password`,`email`) VALUES ('" + name + "','" + pass + "','" + email + "')";
  
       var query = connection.query(sql, function(err, result) {
  
          message = "Succesfully! Your account has been created.";
          res.render('signup.ejs',{message: message});
       });
  
    } else {
       res.render('signup.ejs');
    }
 };