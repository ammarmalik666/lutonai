export const welcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Welcome to Luton AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-width: 100%; background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header with brand color -->
                    <tr>
                        <td style="background-color: #C8102E; padding: 40px 30px; text-align: center;">
                            <img src="https://www.luton.ai/_next/image?url=%2Flogo.png&w=384&q=75" alt="Luton AI Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Welcome to Luton AI!</h1>
                        </td>
                    </tr>
                    
                    <!-- Main content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #374151;">Dear ${name},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #374151;">Thank you for joining the Luton AI community! We're excited to have you on board.</p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #374151;">As a member, you'll get access to:</p>
                            
                            <ul style="margin: 0 0 20px; padding-left: 20px; color: #374151;">
                                <li style="margin-bottom: 10px;">Cutting-edge AI research and insights</li>
                                <li style="margin-bottom: 10px;">Exclusive workshops and events</li>
                                <li style="margin-bottom: 10px;">Networking with AI professionals</li>
                                <li style="margin-bottom: 10px;">Regular updates on AI advancements</li>
                            </ul>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #374151;">Stay connected with us:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="https://lutonai.com/community" style="display: inline-block; padding: 12px 24px; background-color: #C8102E; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Our Community</a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f3f4f6; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                                You received this email because you registered at Luton AI.
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                © 2024 Luton AI. All rights reserved.<br>
                                123 AI Street, London, UK
                            </p>
                            <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                                <a href="https://lutonai.com/unsubscribe?email=${encodeURIComponent(name)}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> |
                                <a href="https://lutonai.com/privacy" style="color: #6b7280; text-decoration: underline;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
