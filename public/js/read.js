function likefunction(id) {
        
    type='add'
    cur_color =  $('#btnlike').text().trim();
    if(cur_color=='liked'){
      type='negative'
    }
    
$.ajax({
type: 'POST',
url: '/like',
data: { id:id ,type_:type}

}).done(function(data) {


$('#like_counter').text(data.likesUpdated[0].likes);
$('#like_').text(data.likesUpdated[0].likes);
if(cur_color=='liked'){
  
  $('#btnlike').text("like");
      $('#likeimg').show();
      $('#likedimg').hide(); //white img src
    }
  else{
     $('#btnlike').text("liked");
   $('#likeimg').hide(); //blue img src
   $('#likedimg').show();
  }
      });
};
function post_comment(post,accountid){
var comment = document.getElementById('comment_box').value;

if (comment != "") {

$.ajax({
type: 'POST',
url: '/comment',
data: { id: post,comment_cur:comment,user:accountid}


}).done(function(data) {

$('#comments_count').text(data.commentsupdated[0].commentscount);
$('#comments__').text(data.commentsupdated[0].commentscount);

var html = document.createElement('div');
var para= document.createElement('p');
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
$(para).html(comment);

$(html).addClass('card col-8').append(para);
$(html).append("<hr>")
$(html).append('<p class="card-text"> <small class="date">' +today+'</small></p>')
$(html).prependTo('#comment_area');
$('#comment_box').val('');
      });









}

}

var main = function() {
//selects all the form elements on the page
$('form').submit(function(event) {
var $input = $(event.target).find('input');
var comment = $input.val();


// stop browser from refreshing the page
return false;

});
}

$(document).ready(main);