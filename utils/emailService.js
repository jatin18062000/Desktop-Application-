const nodemailer = require("nodemailer")

const sendEmail = async (to, subject, text) => {
  try {
    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Missing email credentials: Please set EMAIL_USER and EMAIL_PASS environment variables")

      // Development fallback
      if (process.env.NODE_ENV === "development") {
        const code = text.match(/\d{6}/)?.[0] || text.match(/Code:\s*(\d+)/)?.[1] || null
        console.log("\n🔹 Development Mode - Email would have been sent:")
        console.log("🔹 To:", to)
        console.log("🔹 Subject:", subject)
        if (code) console.log("🔹 Verification Code:", code)
        console.log("🔹 Continuing without sending email...\n")
        return true
      }

      return false
    }

    // Create transporter for Gmail SMTP with OAuth2
    // This is more secure and reliable than password auth
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Show debug output
      logger: true, // Log information into the console
    })

    // Verify transporter config (optional but useful in dev)
    await transporter.verify()
    console.log("📧 Email transporter is ready")

    // Construct HTML content
    const code = text.match(/\d{6}/)?.[0] || text.match(/Code:\s*(\d+)/)?.[1] || null

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F4C8B; margin: 0;">ZYNOTEX</h1>
          <p style="color: #666; margin: 5px 0;">Employee Management System</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">${subject}</h2>
          <div style="font-size: 16px; line-height: 1.6; color: #555;">
            ${
              code
                ? `<p>Your verification code is:</p>
                   <div style="background-color: #4F4C8B; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; margin: 15px 0;">
                     ${code}
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
    `

    // Email options
    const mailOptions = {
      from: `"ZYNOTEX System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: htmlContent,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.messageId)
    console.log("📧 Email sent to:", to)
    return true
  } catch (error) {
    console.error("❌ Email sending failed:", error.message)

    // Log more detailed error information
    if (error.code) console.error("Error code:", error.code)
    if (error.command) console.error("Failed command:", error.command)
    if (error.response) console.error("Server response:", error.response)

    // Fallback logging in development
    if (process.env.NODE_ENV === "development") {
      const code = text.match(/\d{6}/)?.[0] || text.match(/Code:\s*(\d+)/)?.[1]
      if (code) {
        console.log("🔹 Development Mode - OTP/Code for testing:", code)
        console.log("🔹 Intended recipient:", to)
      }
      console.log("🔹 Continuing in development mode without email...")
      return true
    }

    return false
  }
}

module.exports = sendEmail
