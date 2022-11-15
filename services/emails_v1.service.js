
const Mailer = require('nodemailer');
const AWS = require('aws-sdk');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const handlebars = require("handlebars");
const fs = require("fs")

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
const credentialsTemplateSource = fs.readFileSync(path.join(__dirname+'/../views/email/', "credentials.hbs"), "utf8");
const forgotPasswordTemplateSource = fs.readFileSync(path.join(__dirname+'/../views/email/', "forgot-password.hbs"), "utf8");
const leadStatusTemplateSource = fs.readFileSync(path.join(__dirname+'/../views/email/', "lead-status.hbs"), "utf8");
const studentInvoiceTemplateSource = fs.readFileSync(path.join(__dirname+'/../views/email/', "student-invoice.hbs"), "utf8");
const packageExpiredReminderTemplateSource = fs.readFileSync(path.join(__dirname+'/../views/email/', "expired-reminder.hbs"), "utf8");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRECT_KEY,
    region: 'ap-southeast-2'
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
	
	//if(options && options.template)
	
	//transporter.use('compile', hbs(hbsConfigs));
	
	//const template = handlebars.compile(emailTemplateSource)

	transporters[options.name] = transporter ;
	return transporter ;
};

service.getTransporter = async function(name){
	//return transporters[name].use('compile', hbs(hbsConfigs)) ;
	return transporters[name] ;
}

service.signupConfirmationMail = async function(options = {}){
	let opt = options || {} ;
	const template = handlebars.compile(credentialsTemplateSource)
	//const emailBody = "Dear <strong>"+opt.username?opt.username:opt.email.split('@')[0]+"</strong>,<br>"+opt.password?("Your account credentials:<br><strong>Email:"+opt.email+"<strong><br><strong>Password:"+opt.password+"</strong><br>"):""+"Welcome To CRM. Please <a target='_blank' href='"+DEFAULT_HOST+"/users/"+opt.verificationCode+"/email-verification'>confirm your signup at CRM.</a>";
	
	const userName = opt.email;
	const password = opt.password;

	const htmlToSend = template({userName: userName, password:password})


	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			console.log('OPT==> ',opt);
			return await transporter.sendMail({
					from:'"CRM " <souravsengpt@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					html:htmlToSend
			});
		})
		.catch(err=>err);
};


service.forgetPasswordMail = async function(options = {}){
	let opt = options || {} ;
	const template = handlebars.compile(forgotPasswordTemplateSource)
	
	const verificationCode = opt.resetCode;
	const appUrl = process.env.APP_URl;
	const htmlToSend = template({verificationCode: verificationCode, appUrl:appUrl})

	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			console.log('OPT==> ',opt);
			return await transporter.sendMail({
					from:'"CRM " <souravsengpt@gmail.com>',
					to:opt.email,
					subject:opt.subject,
					html:htmlToSend
			});
		})
		.catch(err=>err);
};


service.paymentConfirmationMail = async function(options = {}){
	let opt = options.optionData || {} ;
	
	//console.log('option data' , options.optionData.invoice_id);
	//return options;


	//const emails = ['email1@gmail.com', 'email2@gmail.com'];
	const subject = 'Payment Confirmation';
	const template = handlebars.compile(studentInvoiceTemplateSource)
	//const template = handlebars.compile(forgotPasswordTemplateSource)
	const role_id = opt.role_id;
	if(role_id===3){
		//const template = handlebars.compile(studentInvoiceTemplateSource)
	}
	const invoice_id = opt.invoice_id;
	
	const emails = [opt.payer_email, 'souravsengpt@gmail.com'];

	//return opt;

	const htmlToSend = template({opts: opt, file_path: process.env.FILE_SERVER})
	console.log('htmlToSend ', htmlToSend);
	return htmlToSend;
	//return htmlToSend;
	//console.log('emails ', emails);
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			console.log('OPT==> ',opt);
			return await transporter.sendMail({
					from:'"CRM " <souravsengpt@gmail.com>',
					to: emails,
					subject:subject,
					html:htmlToSend
			});
		})
		.catch(err=>err);
};


service.reminderConfirmationMail = async function(options = {}){
	let opt = options.optionData || {} ;
	
	//console.log('option data' , options.optionData.invoice_id);
	//return options;


	//const emails = ['email1@gmail.com', 'email2@gmail.com'];
	const subject = opt.subject;

	//console.log(subject);
	//return subject;

	const template = handlebars.compile(packageExpiredReminderTemplateSource)
	//const template = handlebars.compile(forgotPasswordTemplateSource)
	
	
	const emails = [opt.user_details.email, 'souravsengpt@gmail.com'];

	//return opt;

	const htmlToSend = template({opts: opt})
	console.log('htmlToSend ', htmlToSend);
	return htmlToSend;
	//return htmlToSend;
	//console.log('emails ', emails);
	return this.getTransporter('signup')
	    .then(async (transporter)=>{
			console.log('OPT==> ',opt);
			return await transporter.sendMail({
					from:'"CRM " <souravsengpt@gmail.com>',
					to: emails,
					subject:subject,
					html:htmlToSend
			});
		})
		.catch(err=>err);
};


service.leadStatusMail = async function(options = {}){
	let opt = options || {} ;
	const template = handlebars.compile(leadStatusTemplateSource)
	console.log('option data' , options.optionData.invoice_id);
	return options;
	const subject = 'Lead status';

	//const fullName = opt.full_name;
	//const courseCode = opt.course_code;

	//const htmlToSend = template({full_name: fullName, course_code:courseCode})

	// return this.getTransporter('signup')
	//     .then(async (transporter)=>{
	// 		console.log('OPT==> ',opt);
	// 		return await transporter.sendMail({
	// 				from:'"CRM " <souravsengpt@gmail.com>',
	// 				to:opt.email,
	// 				subject:opt.subject,
	// 				html:htmlToSend
	// 		});
	// 	})
	// 	.catch(err=>err);
};



// service.confirmJobAlertMail = async function(options = {}){
// 	let opt = options || {} ;
// 	return this.getTransporter('signup')
// 	    .then(async (transporter)=>{
// 			return await transporter.sendMail({
// 					from:'"JobAlert " <alert.j.47@gmail.com>',
// 					to:opt.email,
// 					subject:opt.subject,
// 					template:'confirm_job_alert_mail',
// 					context:{
// 						username:opt.username,
// 						email:opt.email,
// 						confirmLink:"<a href='"+opt.confirmLink+"'>Please click to confirm your alert</a>"
// 					}
// 			});
// 		})
// 		.catch(err=>err);
// };

// service.sendJobAlertMail = async function(options = {}){
// 	let opt = options || {} ;
// 	return this.getTransporter('signup')
// 	    .then(async (transporter)=>{
// 			return await transporter.sendMail({
// 					from:'"JobAlert " <alert.j.47@gmail.com>',
// 					to:opt.email,
// 					subject:opt.subject,
// 					template:'job_alert_template',
// 					context:{
// 						data:opt.data,
// 						email:opt.email,
// 						maxIndex:opt.maxIndex
// 					}
					
// 			}).catch(err=>{console.log(err)});
// 		})
// 		.catch(err=>err);
	
// };
// service.jobApplyMailForEmployeer = async function(options = {}){
// 	let opt = options || {} ;
// 	return this.getTransporter('signup')
// 	    .then(async (transporter)=>{
// 			return await transporter.sendMail({
// 					from:'"JobAlert " <alert.j.47@gmail.com>',
// 					to:opt.email,
// 					subject:opt.subject,
// 					attachments:[{path:opt.resumeFilePath}],
// 					template:'job_apply_for_employeer_template',
// 					context:{
// 						data:opt.data,
// 					}
					
// 			}).catch(err=>{console.log(err)});
// 		})
// 		.catch(err=>err);
// };
// service.emailForInterviewCall = async function(options = {}){
// 	let opt = options || {} ;
// 	return this.getTransporter('signup')
// 	    .then(async (transporter)=>{
// 			return await transporter.sendMail({
// 					from:'"JobAlert " <alert.j.47@gmail.com>',
// 					to:opt.email,
// 					subject:opt.subject,
// 					template:'job_apply_for_candidate_template',
// 					context:{
// 						data:opt.interviewMessage,
// 					}
					
// 			}).catch(err=>{console.log(err)});
// 		})
// 		.catch(err=>err);
// };
module.exports = service ;