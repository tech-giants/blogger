$(document).ready(function(){

    $("#contentarea").ready(function(){
        var content = $("#contentarea").val();
        $("#preview-div").html(content);
    });

    $("#contentarea").on('keyup', function() {
        var content = $("#contentarea").val();
        $("#preview-div").html(content);
    });
});