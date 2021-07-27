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
$(document).ready(function(){
    $("#contentarea").on('keyup', function() {
        var max = 5000,
            len = this.value.length,
            lbl = $('#lblcount');
        if(len >= max) {
            lbl.text(' you have reached the limit')
            .addClass("lblCountRed").removeClass('lblCountGreen');
        } else {
            var ch = len;
            lbl.text(ch)
            .addClass("lblCountGreen").removeClass('lblCountRed');
        }
    });

    let imagesPreview = function(input, placeToInsertImagePreview) {
    if (input.files) {
      let filesAmount = input.files.length;
      for (i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        reader.onload = function(event) {
          $($.parseHTML("<img>"))
            .attr("src", event.target.result)
            .appendTo(placeToInsertImagePreview);
        };
        reader.readAsDataURL(input.files[i]);
      }
    }
  };
  $("#input-files").on("change", function() {
    imagesPreview(this, "div.preview-images");
  });
});