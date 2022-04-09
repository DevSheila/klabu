const express = require('express');
const router= express.Router();
const leadController= require('../controllers/leadController');

// create,find,update,delete

router.get('/',leadController.view);
router.post('/',leadController.find);
router.get('/addLead',leadController.form);
router.post('/addLead',leadController.create);
router.get('/editLead/:id',leadController.edit);
router.post('/editLead/:id',leadController.update);
router.get('/deleteLead/:id',leadController.delete);

module.exports=router;