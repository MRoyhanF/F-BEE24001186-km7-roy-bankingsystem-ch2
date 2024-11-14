import { transporter } from "../config/mailer.js";
import jwt from "jsonwebtoken";

export const homePage = (req, res) => {
  res.render("index", { title: "Binar Royhan", description: "Banking Open API" });
};

export const forgotPassword = (req, res) => {
  res.render("forgot-password");
};

export const resetPassword = (req, res) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    console.log("Decoded email:", decoded.email);

    res.render("reset-password", { email: decoded.email });
  });
};

export const mailer = async (req, res) => {
  const { email } = req.body;

  const subject = "Reset Your Password";
  const text = "We received a request to reset the password for your account. Please click the link below to reset your password.";

  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const url = "http://localhost:3050/reset-password";
  const resetUrl = `${url}?token=${token}`;

  const htmlContent = `
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <tr>
            <td align="center" style="font-size: 24px; color: #4CAF50; font-weight: bold; padding-bottom: 20px;">Password Reset Request</td>
          </tr>
          <tr>
            <td style="font-size: 16px; line-height: 1.6; color: #555;">
              <p>Hello,</p>
              <p>We received a request to reset the password for your account. If you did not request this change, you can safely ignore this email. Otherwise, please click the button below to reset your password:</p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <!-- Tombol reset password dengan link -->
              <a href="${resetUrl}" style="display: block; background-color: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-size: 16px; margin-top: 20px; width: 200px; text-align: center;">Reset Password</a>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; line-height: 1.6; color: #555; padding-top: 20px;">
              <p>If you have any questions, feel free to contact our support team.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 12px; color: #777; padding-top: 20px;">
              <p>Thank you for being with us!</p>
              <p>Need help? <a href="mailto:froyhan0@gmail.com" style="color: #4CAF50;">Contact us</a></p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
    html: htmlContent,
  };

  try {
    // Mengirim email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email terkirim: ", info.response);
    res.status(200).json({ message: "Email berhasil dikirim", info: info.response });
  } catch (error) {
    console.error("Error saat mengirim email:", error);
    res.status(500).json({ message: "Gagal mengirim email", error });
  }
};
