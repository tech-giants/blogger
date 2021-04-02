const session = require('express-session')
const connection = require('../models/db')
const truncate = require('truncate');
var multer  = require('multer');
var fs = require('fs');
const imageToBase64 = require('image-to-base64');
// var popup = require('popups');
var imageMiddleware= require('../middlewares/store-image');
// index page
exports.index = (req, res) => {
    // SELECT * FROM tbl LIMIT 5,10; 
    page=0;
    if(req.params.page){
        page=req.params.page
    }
    console.log(`SELECT *  FROM posts LIMIT ${page},2`);
    connection.query(
        
        'SELECT *  FROM posts LIMIT ?,2',[page],
        (error, results) => {
            res.render('index.ejs', {posts: results, verified: req.session.loggedin, Truncate: truncate});
        }
    );
}

exports.search = (req, res) => {
    connection.query(
        
        `SELECT * FROM posts where title LIKE '%`+req.body.search+`%'`,
        (error, results) => {
            res.render('search.ejs', {posts: results, verified: req.session.loggedin, Truncate: truncate});
        }
    );
}

// login and register
exports.login = (req, res) => {
    if (req.session.loggedin)
    {
        res.redirect('/');
    } else {
        res.render('login.ejs', {verified: req.session.loggedin});
    }
}


// admin edit blog post
exports.edit = (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.params.id],
            (error, results) => {
                res.render('edit.ejs', {post: results[0], verified: req.session.loggedin});
            }
        );
    }
}

// Update method for /edit page
exports.update = (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [req.body.title, req.body.content, req.params.id],
            (error, results) => {
                res.redirect('/');
            }
        );
    }
}

// delete
exports.delete = (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'DELETE FROM posts WHERE id = ?',
            [req.params.id],
            (error, results) => {
                res.redirect('/');
            }
        );
    } else {
        res.send('something went wrong !');
    }
}

// new blog (get)
exports.new_get = (req, res) => {
    
    if(req.session.loggedin) {
        res.render('new.ejs', {verified: req.session.loggedin});
    } else {
        res.redirect('/login');
    }
}

// new blog (post)
exports.new_post = (req, res) => {
    // debugger;
    var upload = multer({
        storage: imageMiddleware.image.storage(), 
        allowedImage:imageMiddleware.image.allowedImage 
        }).single('image');
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
               res.send(err);
            } else if (err) {
               res.send(err);
            }else{
               // store image in database
               var title=req.body.title;
               var content =  req.body.content;
               
               console.log(req.file);
               console.log(req.body);
                // var imageName = req.file.originalname
                var imageName =req.file.originalname;
                var inputValues = {
                   image_name: imageName
                }
                connection.query(
                    'INSERT INTO posts(title, content, post_date,image) VALUES(?, ?, NOW(),?)',
                    [title, content,'images/'+ imageName],
                    (error, results) => {
                        res.redirect('/');
                    }
                );
               
                
            }
            
         }); 
}

// viewing the post
exports.post = (req, res) => {
   
    connection.query(
        'SELECT * FROM posts WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('read.ejs', {post: results[0], verified: req.session.loggedin});
        }
    );
}
exports.like = (req, res) => {
    connection.query(
        'update posts set likes=likes+1 WHERE id = ?',
        [req.body.id],
        (error, results) => {
        }
    )
    res.json({ access: 'logged' });

}

exports.views = (req,res) =>{
    console.log("I am in controller");
    connection.query(
        'update posts set views=views+1 WHERE id = ?',
        [req.body.id],
        (error, results) => {
        }
    )
}