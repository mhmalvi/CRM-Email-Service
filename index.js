const express = require('express') ;
const Emails = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');

const PORT = 9000;


Emails.use(bodyParser.json());
Emails.use(bodyParser.urlencoded({ extended: true }));

//Emails.use(bodyParser.json({limit:'1000mb',extended:true}));
//Emails.use(bodyParser.urlencoded({limit:'1000mb',extended: true}));
//Emails.use(cookieParser());
//Emails.use(helmet());
//Emails.set('view engine','ejs');
//Emails.set('views',path.resolve(__dirname+'/views/'));
Emails.use('/emails/v1/api/',require('./routes/v1'));
//Emails.use('/admin/emails/v1/',require('./routes/admin_v1'));
//Emails.enable('view cache');
Emails.listen(PORT,()=>{
	console.log("server start at "+PORT);
});

Emails.all('*',(req,res,next)=>{
	return res.sendStatus(404);
});