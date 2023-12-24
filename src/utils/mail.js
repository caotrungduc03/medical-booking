const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => console.log('Connected to email server'))
  .catch(() =>
    console.log(
      'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
    ),
  );

const sendEmail = (to, subject, text) => {
  const msg = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };
  transporter.sendMail(msg);
};

const sendVerificationEmail = (to, fullName, token = '') => {
  const subject = 'Xác thực địa chỉ email';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = process.env.VERIFICATION_EMAIL_URL;
  const text = `
    Xin chào ${fullName},
    Để xác minh địa chỉ email của bạn, hãy nhấp vào liên kết này: ${verificationEmailUrl}?token=${token}
    Nếu bạn không tạo tài khoản, vui lòng bỏ qua email này.
  `;
  sendEmail(to, subject, text);
};

const sendApprovalConfirmation = (body) => {
  const {
    to,
    fullName,
    medicalTime,
    medicalOrder,
    place,
    doctorName,
    deniedReason,
    isApproved,
  } = body;
  const subject = 'Xác nhận Phê duyệt Đơn Khám Bệnh';
  let text;
  if (isApproved) {
    text = `
    Xin chào ${fullName},
    Đơn khám bệnh của bạn đã được chấp nhận.
    Thời gian khám: ${medicalTime}
    Số thứ tự: ${medicalOrder}
    Địa điểm: ${place}
    Bác sĩ phụ trách: ${doctorName}
    Vui lòng đến đúng giờ theo đơn khám đã đăng ký.
  `;
  } else {
    text = `
    Xin chào ${fullName},
    Rất tiếc, đơn khám bệnh của bạn đã không được chấp nhận.
    Vì lý do: ${deniedReason || ''}
    Vui lòng xem xét lại đơn khám và gửi lại khi đã sửa đổi.
  `;
  }

  sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendApprovalConfirmation,
};
