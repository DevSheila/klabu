const express = require('express');
const router= express.Router();
const authController= require('../controllers/authController');

// create,find,update,delete
router.get('/',authController.view);

router.get('/login',authController.getLogin);
router.get('/signup',authController.getSignup);




module.exports=router;



