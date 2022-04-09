const express = require('express');
const router= express.Router();
const eventController= require('../controllers/eventController');

// create,find,update,delete

router.get('/',eventController.view);
router.post('/',eventController.find);
router.get('/addEvent',eventController.form);
router.post('/addEvent',eventController.create);
router.get('/editEvent/:id',eventController.edit);
router.post('/editEvent/:id',eventController.update);
router.get('/deleteEvent/:id',eventController.delete);

module.exports=router;