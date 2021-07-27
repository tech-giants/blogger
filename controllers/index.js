const session = require('express-session')
const connection = require('../models/db')
const truncate = require('truncate');
var dateFormat = require('dateformat');

var multer  = require('multer');
var fs = require('fs');
const imageToBase64 = require('image-to-base64');
var uuidV4 = require('uuid');
// var popup = require('popups');
var imageMiddleware= require('../middlewares/store-image');
const { POINT_CONVERSION_HYBRID } = require('constants');
// index page

var cur_page=0;
exports.index = (req, res) => {
    // SELECT * FROM tbl LIMIT 5,10; 
    limit=5;
    skip=0;
    
    
    if(req.query.skip){
       
       
        skip=req.query.skip
    }
  
   query=`SELECT accounts.username , posts.*, count(comments.postid) as number_of_comments from posts INNER JOIN accounts ON posts.accountid = accounts.id left join comments on (posts.id = comments.postid) group by posts.id LIMIT  ` + limit + ` OFFSET ` + skip;
    connection.query(
        query,
        (error, results) => {
           
            res.render('index.ejs', {posts: results, verified: req.session.loggedin,id:req.session.accountid, Truncate: truncate,dateformat__:dateFormat});
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
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
// Update method for /edit page
exports.update = (req, res) => {
    if (req.session.loggedin) {
      
       
           
            var upload = multer({
                storage: imageMiddleware.image.storage(), 
                allowedImage:imageMiddleware.image.allowedImage ,

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
                       
                    
                    
                        // var imageName = req.file.originalname
                        var imageName = req.file ? req.file.filename : "";
                      
                        // const DATE_FORMATER = require( 'dateformat' );
                        // var datetme = DATE_FORMATER( new Date(), "yyyy-mm-dd " );
                        var inputValues = {
                           image_name: imageName
                        }
                        if(imageName!=""){
                        connection.query(
                            'UPDATE posts SET title = ?, content = ? ,image=? WHERE id = ?',
                            [title, content,'images/'+ imageName, req.params.id],
                            (error, results) => {
                                res.redirect('/');
                            }
                        );
                        }
                        else{
                            connection.query(
                                'UPDATE posts SET title = ?, content = ? WHERE id = ?',
                                [title, content,req.params.id],
                                (error, results) => {
                                    res.redirect('/');
                                }
                            );
                            }
        
                    
                       
                        
                    }
                    
                 }); 
        
       
    }
    else{
        res.redirect('/');
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
               console.log("contentttt ",content);
               
              
                // var imageName = req.file.originalname
                var imageName = req.file ? req.file.filename : "";
                // const DATE_FORMATER = require( 'dateformat' );
                // var datetme = DATE_FORMATER( new Date(), "yyyy-mm-dd " );
                var inputValues = {
                   image_name: imageName
                }
               

                connection.query(
                    'INSERT INTO posts(title, content, post_date,image,	accountid) VALUES(?, ?, NOW(),?,?)',
                    [title, content,'images/'+ imageName,req.session.accountid],
                    (error, results) => {
                        console.log("error ",error);
                        res.redirect('/');
                    }
                );
               
                
            }
            
         }); 
}

// viewing the post
exports.post = (req, res) => {
 
//    if(req.session.accountid){}
var liked=false;
if(req.session.loggedin){
  
 query2="select * from likes_views where accountid=? and postid=?"
connection.query(
 query2,
 [ req.session.accountid,req.query.id],
 (error, results) => {
    
     if(results.length>0){
        liked=true;
        connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.query.id],
            (error, results) => {
                
                connection.query('select c.Commentid As commentid, c.comments as comments ,c.comment_date as comment_date,a.username as username FROM `comments` as c JOIN accounts as a ON c.accountid = a.id where c.postid = ?',[req.params.id],(error,results_comment) => {
                  
                    res.render('read.ejs', {like:true,post: results[0],comments:results_comment, verified: req.session.loggedin,accountid_:req.session.accountid,dateformat__:dateFormat,comments_count:results_comment.length});
    
                });
                
            }
        );
     }
     else{
        connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.query.id],
            (error, results) => {
                
                connection.query('select c.Commentid As commentid, c.comments as comments ,c.comment_date as comment_date,a.username as username FROM `comments` as c JOIN accounts as a ON c.accountid = a.id where c.postid = ?',[req.params.id],(error,results_comment) => {
                  
                    res.render('read.ejs', {like:false,post: results[0],comments:results_comment, verified: req.session.loggedin,accountid_:req.session.accountid,dateformat__:dateFormat,comments_count:results_comment.length});
    
                });
                
            }
        );
     }
 }
 
);
}
else{

    connection.query(
        'SELECT * FROM posts WHERE id = ?',
        [req.query.id],
        (error, results) => {
            
            connection.query('select c.Commentid As commentid, c.comments as comments ,c.comment_date as comment_date,a.username as username FROM `comments` as c JOIN accounts as a ON c.accountid = a.id where c.postid = ?',[req.params.id],(error,results_comment) => {
              
                res.render('read.ejs', {like:false,post: results[0],comments:results_comment, verified: req.session.loggedin,accountid_:req.session.accountid,dateformat__:dateFormat,comments_count:results_comment.length});

            });
            
        }
    );
}
}
exports.like = (req, res) => {
    query='update posts set likes=likes+1 WHERE id = ?'
    query3='insert into likes_views(postid,accountid) VALUES(?,?)'
    if(req.body.type_=='negative'){
        query='update posts set likes=likes-1 WHERE id = ?'
        query3='DELETE FROM likes_views  WHERE postid=? and accountid=? '
        
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
    
    connection.query(
        query3,
        [req.body.id, req.session.accountid],
        (error, results) => {
           
        }
        
    )
        
    
    

}
exports.comment = (req, res) => {
  
    connection.query(
        'insert into comments(comments,postid,accountid) VALUES(?,?,?)',
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