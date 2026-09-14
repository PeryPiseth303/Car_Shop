import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

def send_gmail_otp(
    to_email: str,
    otp_code: str,
    purpose: str = "verification",
    recipient_name: Optional[str] = None
) -> bool:
    """
    Sends an OTP verification email to the user via Gmail SMTP.
    If SMTP credentials are not configured or connection fails,
    logs the OTP to console and returns False without breaking the application.
    """
    subject_map = {
        "login": "Your Aurelia Motors Sign-In Verification Code",
        "register": "Verify Your New Aurelia Motors Account",
        "forgot": "Reset Your Aurelia Motors Password",
        "verification": "Your Aurelia Motors Verification Code",
    }
    subject = subject_map.get(purpose, "Your Aurelia Motors Security Code")
    greeting_name = recipient_name or "Valued Client"

    # Always log OTP in server console for local testing and developer visibility
    print(f"\n=======================================================")
    print(f" [EMAIL OTP DISPATCH] -> {to_email}")
    print(f" Purpose: {purpose.upper()}")
    print(f" Security Code: {otp_code}")
    print(f"=======================================================\n")

    # Check if Gmail credentials are provided
    smtp_user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    smtp_password = settings.SMTP_PASSWORD.strip() if settings.SMTP_PASSWORD else ""

    if not smtp_user or not smtp_password:
        logger.info(
            f"Gmail SMTP credentials not configured in .env. OTP for {to_email} is: {otp_code}"
        )
        return False

    sender_email = settings.SMTP_FROM_EMAIL.strip() or smtp_user
    sender_name = settings.SMTP_FROM_NAME.strip() or "Aurelia Motors"

    # Construct HTML body with luxury styling
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0b0f19; color: #e5e7eb; margin: 0; padding: 24px; }}
        .card {{ max-width: 500px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; }}
        .header {{ text-align: center; border-bottom: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; }}
        .logo {{ font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #f59e0b; text-transform: uppercase; }}
        .title {{ font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 8px; }}
        .text {{ font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 24px; }}
        .otp-box {{ background: #1f2937; border: 1px dashed #f59e0b; border-radius: 8px; text-align: center; padding: 18px; margin: 20px 0; }}
        .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #f59e0b; font-family: monospace; }}
        .footer {{ font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #1f2937; padding-top: 20px; margin-top: 24px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">AURELIA MOTORS</div>
        </div>
        <div class="title">Hello, {greeting_name}</div>
        <div class="text">
          You requested a security verification code to complete your <strong>{purpose}</strong> request on Aurelia Motors.
        </div>
        <div class="otp-box">
          <div class="otp-code">{otp_code}</div>
        </div>
        <div class="text">
          This code is confidential and will expire in <strong>10 minutes</strong>. If you did not initiate this action, please ignore this email or contact customer support immediately.
        </div>
        <div class="footer">
          &copy; Aurelia Motors Luxury Marketplace. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    """

    plain_content = f"""
Hello {greeting_name},

Your Aurelia Motors {purpose} verification code is: {otp_code}

This code will expire in 10 minutes. If you did not request this, please disregard.

— Aurelia Motors Security Team
"""

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = to_email

        msg.attach(MIMEText(plain_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=8) as server:
            if settings.SMTP_TLS:
                server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(sender_email, [to_email], msg.as_string())

        logger.info(f"Successfully dispatched Gmail OTP to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to deliver Gmail OTP to {to_email}: {e}")
        return False
