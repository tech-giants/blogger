const express = require('express')
const router = express.Router();

// the indexController
const indexController = require('../controllers/index')

// indexing methods
router.get('/', indexController.index);


// login and register methods
router.get('/login', indexController.login);
router.post('/search', indexController.search);

// administration pages
// Edit page
router.get('/edit/:id', indexController.edit);
router.post('/update/:id', indexController.update);

// Delete
router.get('/delete/:id' , indexController.delete);


router.get('/new', indexController.new_get);

router.post('/new', indexController.new_post);
router.post('/like', indexController.like);
router.post('/views', indexController.views);
router.get('/post/:id', indexController.post);

module.exports = router