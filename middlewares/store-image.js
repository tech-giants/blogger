var multer = require('multer');
module.exports.image={
    storage:function(){
        var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/images/')
        },
        filename: function (req, file, cb) {

            var file_name_array = file.originalname.split(".");
            var file_extension = file_name_array[file_name_array.length - 1];
            var file_name = file.originalname.split(file_extension)[0];
            cb(null, file_name+"_"+Date.now()+"."+file_extension)
        }
      })
      return storage;
},
allowedImage:function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}}