
const Mailer = require('nodemailer');
const AWS = require('aws-sdk');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const hbsConfigs = {
	viewEngine : {
		extname: '.hbs', // handlebars extension
		layoutsDir: path.resolve(__dirname+'/../views/email/'), // location of handlebars templates
		defaultLayout: 'template', // name of main template
		partialsDir: path.resolve(__dirname+'/../views/email/partials/'), // location of your subtemplates aka. header, footer etc
    },
	viewPath: path.resolve(__dirname+'/../views/email/'),
	extName: '.hbs'
};

AWS.config.update({
    accessKeyId: 'AKIAZ2QPYKS2BH5HDVOB',
    secretAccessKey: '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',
    region: 'us-east-1'
});


const DEFAULT_HOST = 'http://54.66.60.171';

var transporters = {} ;
var service = {} ;


// transporters['signup'] = Mailer.createTransport({
	// host:'mail.your-server.de',
	// port:25,
	// secure:false,
	// auth:{
		// user:'signup@khaledtech.com',
		// pass:'*signuP#1'
	// }
// });
// transporters['signup'] = Mailer.createTransport({
	// service: 'gmail',
	// host:'smtp.gmail.com',
	// port:465,
	// secure:true,
	// auth:{
		// user:'alert.j.47@gmail.com',
		// pass:'*jobalerT#1'
		
	// }
// });
transporters['signup'] = Mailer.createTransport({
	SES: new AWS.SES({
        apiVersion: '2010-12-01'
    }),
	port:25
});



service.createTransporter = async function(opts){
	let options = opts || {};
	
	const transporter =  options ? Mailer.createTransport({
						
		host:options.host,
		port:options.port,
		secure:options.secure,
		auth:options.auth
						
	}) : null ;
	
	if(options && options.template)
		transporter.use('compile', hbs(hbsConfigs));
	
	transporters[options.name] = transporter ;
	return transporter ;
};

service.getTransporter = async function(name){
	return transporters[name].use('compile', hbs(hbsConfigs)) ;
}

service.signupConfirmationMail = async function(options = {}){
	let opt = options || {} ;
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			console.log(opt);
			return await transporter.sendMail({
					from:'"CRM " <souravsengpt@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					html:"Dear <strong>"+opt.username?opt.username:opt.email.split('@')[0]+"</strong>,<br>"+opt.password?("Your account credentials:<br><strong>Email:"+opt.email+"<strong><br><strong>Password:"+opt.password+"</strong><br>"):""+"Welcome To CRM. Please <a target='_blank' href='"+DEFAULT_HOST+"/users/"+opt.verificationCode+"/email-verification'>confirm your signup at CRM.</a>"
			});
		})
		.catch(err=>err);
};




service.forgetPasswordMail = async function(options = {}){
	let opt = options || {} ;
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			return await transporter.sendMail({
					from:'"JobAlert " <alert.j.47@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					html:"Dear <strong>"+opt.email.split('@')[0]+"</strong>,<br>Here Your Password Recovery Code: <strong>"+opt.resetCode+"</strong><br><a target='_blank' href='"+DEFAULT_HOST+"/users/new-password/"+opt.resetCode+"'>Please click here to reset your password</a>"
			});
		})
		.catch(err=>err);
};
service.confirmJobAlertMail = async function(options = {}){
	let opt = options || {} ;
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			return await transporter.sendMail({
					from:'"JobAlert " <alert.j.47@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					template:'confirm_job_alert_mail',
					context:{
						username:opt.username,
						email:opt.email,
						confirmLink:"<a href='"+opt.confirmLink+"'>Please click to confirm your alert</a>"
					}
			});
		})
		.catch(err=>err);
};

service.sendJobAlertMail = async function(options = {}){
	let opt = options || {} ;
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			return await transporter.sendMail({
					from:'"JobAlert " <alert.j.47@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					template:'job_alert_template',
					context:{
						data:opt.data,
						email:opt.email,
						maxIndex:opt.maxIndex
					}
					
			}).catch(err=>{console.log(err)});
		})
		.catch(err=>err);
	
};
service.jobApplyMailForEmployeer = async function(options = {}){
	let opt = options || {} ;
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			return await transporter.sendMail({
					from:'"JobAlert " <alert.j.47@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					attachments:[{path:opt.resumeFilePath}],
					template:'job_apply_for_employeer_template',
					context:{
						data:opt.data,
					}
					
			}).catch(err=>{console.log(err)});
		})
		.catch(err=>err);
};
service.emailForInterviewCall = async function(options = {}){
	let opt = options || {} ;
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			return await transporter.sendMail({
					from:'"JobAlert " <alert.j.47@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					template:'job_apply_for_candidate_template',
					context:{
						data:opt.interviewMessage,
					}
					
			}).catch(err=>{console.log(err)});
		})
		.catch(err=>err);
};
module.exports = service ;