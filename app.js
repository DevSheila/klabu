const express = require('express');
const fileupload = require('express-fileupload');
var hbs = require('hbs');

var handlebars = require('handlebars'),
    layouts = require('handlebars-layouts');
 
handlebars.registerHelper(layouts(handlebars));
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql= require('mysql');
const Connection = require('mysql/lib/Connection');
var path = require('path');
const multer = require('multer')



const app = express();
require('dotenv').config();


const port = process.env.port || 5000;

// parsing middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());

// static files
app.use(express.static(path.join(__dirname,'public'))); 

app.use(fileupload())

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/uploads')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});

//view engine setups
app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine','hbs');
hbs.registerPartials(__dirname+'/views/partials')




// routes
const mainRoutes = require('./server/routes/main');
const aboutRoutes = require('./server/routes/about');
const pathRoutes = require('./server/routes/path');
const leadRoutes = require('./server/routes/lead');
const eventRoutes = require('./server/routes/event');
const authRoutes = require('./server/routes/auth');

app.use('/about',aboutRoutes);
app.use('/paths',pathRoutes);
app.use('/auth',authRoutes);
app.use('/leads',leadRoutes);
app.use('/events',eventRoutes);
app.use('/',mainRoutes);






// ROUTES





// listen to env port or 5000
app.listen(port,(()=>console.log(`listen on port ${port}`)))


