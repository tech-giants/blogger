const session = require('express-session')
const connection = require('../models/db')
const truncate = require('truncate');
var dateFormat = require('dateformat');

var multer  = require('multer');
var fs = require('fs');
const imageToBase64 = require('image-to-base64');
// var popup = require('popups');
var imageMiddleware= require('../middlewares/store-image');
// index page

var cur_page=0;
exports.index = (req, res) => {
    // SELECT * FROM tbl LIMIT 5,10; 
    limit=5;
    skip=0;
    
    
    if(req.query.skip){
       
       
        skip=req.query.skip
    }
  
   query=`SELECT posts.*, count(comments.postid) as number_of_comments from posts left join comments on (posts.id = comments.postid) group by posts.id LIMIT ` + limit + ` OFFSET ` + skip;
    connection.query(
        query,
        (error, results) => {
            res.render('index.ejs', {posts: results, verified: req.session.loggedin, Truncate: truncate,dateformat__:dateFormat});
        }
    );
}

exports.search = (req, res) => {
    limit=5;
    skip=0;
    
    
    if(req.query.skip){
       
       
        skip=req.query.skip
    }
  
    connection.query(
        
        `SELECT * FROM posts where title LIKE '%`+req.query.search+`%' or content LIKE '%`+req.query.search+`%' LIMIT ` + limit + ` OFFSET ` + skip,
        (error, results) => {
            res.render('search.ejs', {posts: results, verified: req.session.loggedin, Truncate: truncate,search_c:req.query.search});
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
            'UPDATE posts SET title = ?, content = ? ,image=? WHERE id = ?',
            [req.body.title, req.body.content,req.params.image, req.params.id],
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
                var imageName = req.file ? req.file.originalname : "";
                // const DATE_FORMATER = require( 'dateformat' );
                // var datetme = DATE_FORMATER( new Date(), "yyyy-mm-dd " );
                var inputValues = {
                   image_name: imageName
                }
               

                connection.query(
                    'INSERT INTO posts(title, content, post_date,image,username) VALUES(?, ?, NOW(),?,?)',
                    [title, content,'images/'+ imageName,req.session.username],
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

            connection.query('select c.Commentid As commentid, c.comments as comments ,c.comment_date as comment_date,a.username as username FROM `comments` as c JOIN accounts as a ON c.accountid = a.id where c.postid = ?',[req.params.id],(error,results_comment) => {
                res.render('read.ejs', {post: results[0],comments:results_comment, verified: req.session.loggedin,accountid_:req.session.accountid,dateformat__:dateFormat,comments_count:results_comment.length});

            });
            
        }
    );
}
exports.like = (req, res) => {
    query='update posts set likes=likes+1 WHERE id = ?'
    if(req.body.type_=='negative'){
        query='update posts set likes=likes-1 WHERE id = ?'
    }
    connection.query(
        query,
        [req.body.id],
        (error, results) => {
        }
    )
    query2='select likes from posts where id = ?'
    connection.query(
        query2,
        [req.body.id],
        (error,likes) =>{
            res.json({ likesUpdated: likes });
        }
    )
    

}
exports.comment = (req, res) => {
    console.log(req.session.userid)
    connection.query(
        'insert into comments(comments,postid,accountid,comment_date) VALUES(?,?,?,NOW())',
        [req.body.comment_cur,req.body.id, req.session.accountid],
        (error, results) => {
        }
        
    )
    
    query2='select count(*) as commentscount from comments where postid = ?'
    connection.query(
        query2,
        [req.body.id],
        (error,commentscount) =>{
            res.json({ commentsupdated: commentscount });
        }
    )
    // query3='select(*)from comments INNER JOINS accounts ON comments.accountid=accounts.account id'
    

}
   

exports.views = (req,res) =>{
    
    connection.query(
        'update posts set views=views+1 WHERE id = ?',
        [req.body.id],
        (error, results) => {
        }
    )
}