# CRM Email Service

A transactional email microservice within the CRM ecosystem that handles templated email delivery for critical system events. Built with Handlebars templates and AWS SES, this service provides a centralized API for sending beautifully formatted emails across the entire CRM platform.

## Overview

The CRM Email Service acts as the primary transactional email gateway for the CRM system. Other microservices call its API endpoints to dispatch emails for user registration, password recovery, payment confirmations, subscription reminders, and lead status updates — all rendered through professionally designed Handlebars templates.

## Key Features

- **Templated Emails** — Pre-built Handlebars (.hbs) templates for consistent, branded email communication
- **AWS SES Integration** — Production-grade email delivery via Amazon Simple Email Service
- **Registration Emails** — Send account credentials and welcome messages to new users
- **Password Recovery** — Secure forgot-password flows with verification codes
- **Payment Confirmations** — Invoice emails for both students and clients with role-based template selection
- **Subscription Management** — Expiration reminders and package expired notifications
- **Lead Status Updates** — Automated emails triggered by lead status changes
- **Versioned API** — Clean v1 API structure for future extensibility

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Email Transport:** Nodemailer with AWS SES
- **Templating:** Handlebars (nodemailer-express-handlebars)
- **Cloud Services:** AWS SDK (SES)
- **Security:** Helmet.js
- **Environment Config:** dotenv

## API Endpoints

All endpoints are prefixed with `/emails/v1/api/`.

| Method | Endpoint                               | Description                                  |
|--------|----------------------------------------|----------------------------------------------|
| POST   | `/emails/v1/api/registration`          | Send registration/welcome email with credentials |
| POST   | `/emails/v1/api/forget-password`       | Send password recovery email with reset code |
| POST   | `/emails/v1/api/lead-status`           | Send lead status change notification         |
| POST   | `/emails/v1/api/payment`               | Send payment confirmation invoice email      |
| POST   | `/emails/v1/api/reminder`              | Send subscription expiration reminder        |
| POST   | `/emails/v1/api/subscription-expired`  | Send package expired notification            |

## Email Templates

| Template               | File                    | Purpose                                    |
|------------------------|-------------------------|--------------------------------------------|
| Credentials            | `credentials.hbs`       | New user account credentials               |
| Forgot Password        | `forgot-password.hbs`   | Password reset verification code           |
| Lead Status            | `lead-status.hbs`       | Lead pipeline status change alerts         |
| Client Invoice         | `client-invoice.hbs`    | Payment confirmation for clients           |
| Student Invoice        | `student-invoice.hbs`   | Payment confirmation for students          |
| Expiration Reminder    | `expired-reminder.hbs`  | Upcoming subscription expiration warning   |
| Package Expired        | `package-expired.hbs`   | Subscription has expired notification      |
| Base Template          | `template.hbs`          | Shared layout wrapper for all emails       |

## Prerequisites

- Node.js (v14 or higher)
- AWS account with SES configured
- Verified sender email in AWS SES

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mhmalvi/CRM-Email-Service.git
   cd CRM-Email-Service
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the project root:
   ```env
   PORT=4000
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRECT_KEY=your_aws_secret_key
   APP_URl=https://your-crm-frontend-url.com
   FILE_SERVER=https://your-file-server-url.com
   ```

4. **Start the service:**
   ```bash
   npm start
   ```

## Project Structure

```
CRM-Email-Service/
├── index.js                    # Application entry point
├── routes/
│   └── v1.js                   # API route definitions
├── services/
│   └── emails_v1.service.js    # Email service logic and transport
├── views/
│   └── email/
│       ├── template.hbs        # Base email layout
│       ├── credentials.hbs     # Registration credentials template
│       ├── forgot-password.hbs # Password recovery template
│       ├── lead-status.hbs     # Lead status template
│       ├── client-invoice.hbs  # Client payment template
│       ├── student-invoice.hbs # Student payment template
│       ├── expired-reminder.hbs# Expiration reminder template
│       └── package-expired.hbs # Package expired template
└── package.json
```

## Architecture

This service is part of a larger **CRM microservices architecture**. It serves as the centralized transactional email service that other microservices (lead management, payments, authentication, etc.) depend on to deliver formatted email communications. It operates independently with its own deployment lifecycle and can be scaled based on email throughput requirements.

## License

ISC
