import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import {
    PUBLIC_APP_NAME,
    PUBLIC_SITE_URL,
    PUBLIC_CONTACT_EMAIL
} from '$env/static/public';

// Theme Constants
const BRAND_PRIMARY = '#00b398';
const BRAND_DARK = '#008f7a';
const BRAND_LIGHT = '#e0f7f4';
const TEXT_DARK = '#0a0a0a';
const TEXT_MUTED = '#666666';

function getResendClient() {
    const resendKey = env.RESEND_API_KEY;

    if (!resendKey) {
        throw new Error('RESEND_API_KEY is not configured in environment variables.');
    }

    return new Resend(resendKey);
}

function getEmailWrapper(title: string, content: string) {
    const appName = PUBLIC_APP_NAME || 'BRISLEY';
    const siteUrl = PUBLIC_SITE_URL || 'https://birsley.in';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: ${TEXT_DARK}; }
                .wrapper { max-width: 600px; margin: 20px auto; padding: 20px; }
                .container { background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; text-align: center; }
                .header { background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%); padding: 40px 24px; color: #ffffff; }
                .header h1 { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; }
                .content { padding: 40px 32px; }
                .field { margin-bottom: 24px; }
                .field-label { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${TEXT_MUTED}; margin-bottom: 8px; }
                .field-value { font-size: 18px; color: ${TEXT_DARK}; line-height: 1.6; }
                .message-box { background-color: ${BRAND_LIGHT}; padding: 30px; border-radius: 16px; margin-top: 32px; display: inline-block; width: 90%; text-align: center; }
                .footer { padding: 32px; border-top: 1px solid #f1f5f9; font-size: 14px; color: ${TEXT_MUTED}; }
                .footer a { color: ${BRAND_PRIMARY}; text-decoration: none; font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin: 32px 0; }
                th { text-align: left; font-size: 13px; font-weight: 600; color: ${TEXT_MUTED}; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
                td { padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 16px; text-align: left; }
                .total-row td { border-bottom: none; padding-top: 24px; }
                .total { color: ${BRAND_PRIMARY}; font-weight: 800; font-size: 24px; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <h1>${title}</h1>
                    </div>
                    <div class="content">
                        ${content}
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} <a href="${siteUrl}">${appName}</a>. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

export async function sendEnquiryEmail(data: { name: string; email: string; phone?: string; message: string }) {
    const smtpUser = env.SMTP_USER;
    const adminEmail = env.ADMIN_EMAIL;
    const appName = PUBLIC_APP_NAME || 'BRISLEY';

    const content = `
        <div class="field">
            <div class="field-label">Sender Name</div>
            <div class="field-value"><strong>${data.name}</strong></div>
        </div>
        <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value"><a href="mailto:${data.email}" style="color: ${BRAND_PRIMARY}; text-decoration: none;">${data.email}</a></div>
        </div>
        <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value">${data.phone || 'Not provided'}</div>
        </div>
        <div class="message-box">
            <div class="field-label" style="margin-bottom: 12px;">Message Content</div>
            <div class="field-value" style="white-space: pre-wrap; font-style: italic;">"${data.message}"</div>
        </div>
    `;

    const resend = getResendClient();
    const { data: responseData, error } = await resend.emails.send({
        from: `"${appName} Alerts" <onboarding@resend.dev>`,
        to: adminEmail,
        replyTo: data.email,
        subject: `[Enquiry] New message from ${data.name}`,
        html: getEmailWrapper(`New Enquiry Received`, content),
    });

    if (error) {
        throw new Error(`Resend email failed: ${error.message}`);
    }

    return responseData;
}

export async function sendOrderEmail(data: { customerName: string; email: string; phone?: string; address: string; itemsJson: string; total: number }) {
    const smtpUser = env.SMTP_USER;
    const adminEmail = env.ADMIN_EMAIL || PUBLIC_CONTACT_EMAIL || smtpUser || 'singh.rohitsingh2k@gmail.com';
    const appName = PUBLIC_APP_NAME || 'BRISLEY';

    const items = JSON.parse(data.itemsJson);
    const itemsHtml = items.map((item: any) => `
        <tr>
            <td>${item.name} <span style="color: ${TEXT_MUTED}; ml-2">× ${item.quantity}</span></td>
            <td style="text-align: right; font-weight: 500;">₹${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const content = `
        <div class="field">
            <div class="field-label">Customer</div>
            <div class="field-value"><strong>${data.customerName}</strong></div>
        </div>
        <div class="field">
            <div class="field-label">Delivery Address</div>
            <div class="field-value">${data.address}</div>
        </div>
        <div class="field">
            <div class="field-label">Contact Details</div>
            <div class="field-value">
                ${data.email}<br>
                ${data.phone || ''}
            </div>
        </div>

        <table style="max-width: 500px; margin-left: auto; margin-right: auto;">
            <thead>
                <tr>
                    <th style="text-align: left;">Item</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tr class="total-row">
                <td style="text-align: left; font-weight: 600; font-size: 18px;">Total</td>
                <td style="text-align: right;" class="total">₹${data.total}</td>
            </tr>
        </table>
    `;

    const resend = getResendClient();
    const { data: responseData, error } = await resend.emails.send({
        from: `"${appName} Sales" <onboarding@resend.dev>`,
        to: adminEmail,
        replyTo: data.email,
        subject: `[Order] New order from ${data.customerName} - ₹${data.total}`,
        html: getEmailWrapper(`New Order Confirmed`, content),
    });

    if (error) {
        throw new Error(`Resend email failed: ${error.message}`);
    }

    return responseData;
}
