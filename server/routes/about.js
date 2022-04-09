const express = require('express');
const router= express.Router();
const aboutController= require('../controllers/aboutController');

// create,find,update,delete

router.get('/',aboutController.view);
router.get('/addAbout',aboutController.form);
router.post('/addAbout',aboutController.create);
router.get('/editAbout/:id',aboutController.edit);
router.post('/editAbout/:id',aboutController.update);
router.get('/deleteAbout/:id',aboutController.delete);


module.exports=router;
