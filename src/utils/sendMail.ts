import Nodemailer from "nodemailer";

interface SendMailOptions {
  email: string;
  url?: string;
}

export async function sendMail({ email, url }: SendMailOptions) {
  console.log(`Sending email to ${email}`);

  const testAccount = await Nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = Nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Nodemailer Test", // Subject line
    text: "This is a nodemailer test email from the server", // plain text body
    html: `<a href='${url}'>${url}</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info));

  // return info;
}
