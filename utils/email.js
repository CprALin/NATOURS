const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');
const pug = require('pug');
const htmlToText = require('html-to-text');

//new Email(user , url).sendWelcome();

module.exports = class Email {
    constructor(user , url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.form = `Cpr Alin <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV === 'production')
        {
            return 1;
        }

        return nodemailer.createTransport({

            host : process.env.EMAIL_HOST,
            port : process.env.EMAIL_PORT,

            auth : {
                user : process.env.EMAIL_USERNAME,
                pass : process.env.EMAIL_PASSWORD
            }

        });
    }

    //send the actual email
    async send(template , subject){
        // 1) Render HTML based on a pug template
         const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName : this.firstName,
            url : this.url,
            subject
         });

        // 2) Define email options
        const mailOptions = {
            from : this.form,
            to : this.to,
            subject,
            html,
            text : htmlToText.fromString(html)
        };

        // 3 ) Create a transport and send Email       
        //      Actually send the email
        await this.newTransport().sendMail(mailOptions);
    };

    async sendWelcome(){
       await this.send('Welcome' , 'Welcome to the Natours Family!');
    }
}

/* const sendEmail = catchAsync(async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        //service : 'Gmail' ,
        auth : {
            user : process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD
        }

        // Activate in gmail "less secure app" option
    });
    
    

    // 2) Define the email options
    const mailOptions = {
        from : 'Cpr Alin <test@yahoo.com>',
        to : options.email,
        subject : options.subject,
        text : options.message,
        //html : 
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
});  */

module.exports = sendEmail;