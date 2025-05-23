const nodemailer = require("nodemailer")

const sendEmail = async (to, subject, text) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail", // You can change this to your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F4C8B;">ZYNOTEX - ${subject}</h2>
          <p style="font-size: 16px; line-height: 1.6;">${text}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            This is an automated email from ZYNOTEX Attendance System. Please do not reply to this email.
          </p>
        </div>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("❌ Email sending failed:", error)

    // For development, log the OTP to console if email fails
    if (process.env.NODE_ENV === "development") {
      console.log("🔹 Development Mode - OTP/Code:", text.match(/\d{6}/)?.[0] || text)
    }

    return false
  }
}

module.exports = sendEmail
