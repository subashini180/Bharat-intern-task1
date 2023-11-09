/*const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const hbs = require('express-handlebars');

const app= express();
//configure mongodb
mongoose.connect("mongodb://127.0.0.1:27017/cms" ,{ useNewUrlParser: true})
 .then(response => {
    console.log("MongoDb connected");
    }).catch(err => {
    console.log("connection failed");
});

//configure express 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

//setup view engine to use handlebars 
//app.engine('handlebars', hbs({defaultLayout:'default'}));
//app.set('view engine','handlebars');
app.engine('hbs', hbs.engine({
    extname:'hbs',
    defaultLayout :'default',
    layoutdir : __dirname +'/views/layouts'
}));

//routes 
app.use('/',(req,res) =>{
   res.render('default/index');
});

app.listen(5000, () =>{
    console.log('server is running on port 5000');

});*/
/* Importing Different Modules */

const {globalVariables} = require('./config/configuration');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');


const app = express();


// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});



/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


/*  Flash and Session*/
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());


/* Use Global Variables */
app.use(globalVariables);


/* File Upload Middleware*/
app.use(fileUpload());

/* Setup View Engine To Use Handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine' , 'handlebars');


/* Method Override Middleware*/
app.use(methodOverride('newMethod'));


/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


/* Start The Server */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});