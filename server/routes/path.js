const express = require('express');
const router= express.Router();
const pathController= require('../controllers/pathController');

// create,find,update,delete

router.get('/',pathController.view);
router.post('/',pathController.find);
router.get('/addPath',pathController.form);
router.post('/addPath',pathController.create);
router.get('/editPath/:id',pathController.edit);
router.post('/editPath/:id',pathController.update);
router.get('/deletePath/:id',pathController.delete);

module.exports=router;