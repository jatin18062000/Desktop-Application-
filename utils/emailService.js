const nodemailer = require("nodemailer")

const sendEmail = async (to, subject, text) => {
  try {
    // Create transporter (note: it's createTransport, not createTransporter)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Additional security options
      secure: true, // Use TLS
      port: 465,
    })

    // Verify transporter configuration
    await transporter.verify()
    console.log("📧 Email transporter is ready")

    // Email options
    const mailOptions = {
      from: `"ZYNOTEX System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F4C8B; margin: 0;">ZYNOTEX</h1>
            <p style="color: #666; margin: 5px 0;">Employee Management System</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">${subject}</h2>
            <div style="font-size: 16px; line-height: 1.6; color: #555;">
              ${
                text.includes("Code:") || text.includes("OTP")
                  ? `<p>Your verification code is:</p>
                 <div style="background-color: #4F4C8B; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; margin: 15px 0;">
                   ${text.match(/\d{6}/)?.[0] || text.match(/Code:\s*(\d+)/)?.[1] || "N/A"}
                 </div>
                 <p style="color: #e74c3c; font-weight: bold;">⏰ This code will expire in 10 minutes</p>`
                  : `<p>${text}</p>`
              }
            </div>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This is an automated email from ZYNOTEX Employee Management System.<br>
              Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.messageId)
    console.log("📧 Email sent to:", to)
    return true
  } catch (error) {
    console.error("❌ Email sending failed:", error.message)

    // For development, log the OTP/code to console if email fails
    if (process.env.NODE_ENV === "development") {
      const code = text.match(/\d{6}/)?.[0] || text.match(/Code:\s*(\d+)/)?.[1]
      if (code) {
        console.log("🔹 Development Mode - OTP/Code for testing:", code)
        console.log("🔹 Email that would have received it:", to)
      }
    }

    // Don't throw error in development mode, just log it
    if (process.env.NODE_ENV === "development") {
      console.log("🔹 Continuing in development mode without email...")
      return true // Return true to continue the flow
    }

    return false
  }
}

module.exports = sendEmail
