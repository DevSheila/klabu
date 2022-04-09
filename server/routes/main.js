const express = require('express');
const router= express.Router();
const mainController= require('../controllers/mainController');

// create,find,update,delete
router.get('/',mainController.view);



module.exports=router;




