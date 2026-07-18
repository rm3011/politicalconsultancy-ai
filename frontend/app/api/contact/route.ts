import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email to owner
    const ownerMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'theedgewithjohn@gmail.com',
      subject: `NEVAS Contact: ${subject}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #b89168, #d4a574); padding: 25px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: #000; margin: 0; font-size: 22px; }
              .header p { color: #000; opacity: 0.8; margin: 5px 0 0; }
              .content { background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none; }
              .field { margin-bottom: 15px; }
              .label { font-weight: 600; color: #495057; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
              .value { background: white; padding: 10px 14px; border-radius: 6px; border: 1px solid #e9ecef; color: #212529; }
              .footer { text-align: center; padding: 15px; color: #868e96; font-size: 12px; border-top: 1px solid #e9ecef; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📩 NEVAS Contact Form</h1>
              <p>New inquiry received from your website</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">📌Subject</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">📝 Message</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef; font-size: 12px; color: #868e96;">
                Received: ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            <div class="footer">
              <p>Reply directly to this email to respond to ${name}.</p>
            </div>
          </body>
        </html>
      `,
    };

    // Auto-reply to user
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thank you for contacting NEVAS',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #b89168, #d4a574); padding: 25px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: #000; margin: 0; font-size: 22px; }
              .content { background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none; }
              .footer { text-align: center; padding: 15px; color: #868e96; font-size: 12px; border-top: 1px solid #e9ecef; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Thank You for Reaching Out</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for contacting <strong>NEVAS</strong>. We have received your message and will get back to you within <strong>24 hours</strong>.</p>
              <div style="background: white; padding: 14px; border-radius: 6px; border: 1px solid #e9ecef; margin: 14px 0;">
                <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 8px 0 0;"><strong>Message:</strong></p>
                <p style="margin: 4px 0 0; color: #495057;">${message}</p>
              </div>
              <p>We appreciate your interest in our services.</p>
              <p>Warm regards,<br><strong>The NEVAS Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} NEVAS. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}