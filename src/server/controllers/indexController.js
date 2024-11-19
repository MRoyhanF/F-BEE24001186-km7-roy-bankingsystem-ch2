import { transporter } from "../config/mailer.js";
import jwt from "jsonwebtoken";

import { UserService } from "../services/userService.js";
import { Error404 } from "../utils/custom_error.js";

const userService = new UserService();

export const homePage = (req, res) => {
  res.render("index", { title: "Binar Royhan", description: "Banking Open API" });
};

export const notification = (req, res) => {
  const domain = process.env.DOMAIN;

  res.render("notification", { domain });
};

export const forgotPassword = (req, res) => {
  res.render("forgot-password");
};

export const resetPassword = (req, res) => {
  const token = req.query.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.id;
  const email = decoded.email;

  res.render("reset-password", { email, id });
};

export const mailer = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error404("User not found");
    }

    const subject = "Reset Your Password";
    const text = "We received a request to reset the password for your account. Please click the link below to reset your password.";

    const secretKey = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ email: email, id: user.id }, secretKey, { expiresIn: "15h" });

    const path = process.env.DOMAIN;
    console.log("path:", path);

    const url = `${path}/reset-password`;
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

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({
      message: "Email berhasil dikirim",
      info: info.response,
      url: resetUrl,
    });
  } catch (error) {
    console.error("Error saat mengirim email:", error);
    if (error instanceof Error404) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Gagal mengirim email", error: error.message });
  }
};
