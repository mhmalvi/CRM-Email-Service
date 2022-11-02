
const express = require('express');
const router = express.Router();
//const Mailer = require('nodemailer');

const service = require('../services/emails_v1.service');

module.exports = router ;

router.route('/signup')
	.post(async (req,res,next)=>{
		
		service.signupConfirmationMail({
			email:req.body.email,
			verificationCode:req.body.verificationCode,
			username:req.body.username?req.body.username:null,
			password:req.body.password?req.body.password:null,
			subject:"Confirm Your Email At CRM"
		})
		.then((info)=>{
			console.log('INFO ',info);
			// insert into mysql
			return res.sendStatus(201);
		})
		.catch((err)=>err);
	});

router.route('/forget-password')
      .post(async (req, res, next)=>{
		  service.forgetPasswordMail({
			  email:req.body.email,
			  resetCode:req.body.resetCode,
			  subject:"Your Password Recovery Code"
		  })
		  .then((info)=>{
			  // insert into mysql
			  console.log("Info: ",info);
			  return res.sendStatus(201);
		  })
		  .catch((err)=>err);
	  });
router.route('/job-apply')
	.post(async (req,res,next)=>{	
		service.jobApplyMailForEmployeer({
		  	resumeFilePath:req.body.resume_file_path,
			email:req.body.company_email,
			data:[],
			accessToken:req.body.access_token,
			subject:req.body.candidate_name+" applied "+req.body.job_title
		})
		.then(async (info)=>{
			// insert into database
			
			service.emailForInterviewCall({
				interviewMessage:req.body.interview_message,
				email:req.body.candidate_email,
				subject:"Congratulations you are shortlisted for "+req.body.job_title+" from "+req.body.company_name
			})
			.then(async (info2)=>{
				// insert into database
			    return res.sendStatus(201);	
			})
			.catch(err=>err);
			
		}).catch(err=>err);
	});
router.route('/confirm-jobalert')
	.post(async (req,res,next)=>{
		service.confirmJobAlertMail({
			email:req.body.email,
			subject:"Please confirm your job alert",
			confirmLink:req.body.confirmLink
		})
		.then(async (info)=>{
			// insert into database
			return res.sendStatus(201);
		}).catch(err=>{
			console.log(err);
			return res.sendStatus(406);
		});
	});
router.route('/send-job-alert')
	.post(async (req,res,next)=>{
		console.log(req.body);
		
		
		let maxRankIndex = 0 ;
		let maxRank = 0 ;
		req.body.data.forEach(function(item, i ){
			if(item.rank && (item.rank > maxRank)){
				maxRankIndex = i;
			}
		});
	
		
		service.sendJobAlertMail({
			email:req.body.email,
			subject:req.body.data[maxRankIndex].companyName+" are start hiring in "+req.body.data[maxRankIndex].jobTitle+ " Position",
			data:req.body.data,
			maxIndex:maxRankIndex
		})
		.then(async (info)=>{
			// insert into database
			console.log(info);
			return res.sendStatus(201);
		}).catch(err=>{
		
			return res.sendStatus(406);
		});
	});