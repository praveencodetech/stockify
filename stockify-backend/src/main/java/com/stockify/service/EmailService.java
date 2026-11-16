package com.stockify.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendHtmlMessage(String to, String subject, String htmlBody) {
        saveEmailPreview(subject, htmlBody); // Save local preview for development
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // Set to true to indicate HTML content
            
            emailSender.send(message);
            logger.info("Email successfully sent to: {}", to);
            
        } catch (MailException | MessagingException e) {
            // Robust Fallback: If no SMTP server is running, log the payload instead.
            logger.warn("Could not send email. (No local SMTP server running?) Fallback logging instead.");
            logger.info("================ EMAIL PAYLOAD FALLBACK ================");
            logger.info("To: {}", to);
            logger.info("Subject: {}", subject);
            logger.info("Body (HTML snippet): \n{}", htmlBody.substring(0, Math.min(htmlBody.length(), 500)) + "...");
            logger.info("=========================================================");
        }
    }

    private void saveEmailPreview(String subject, String htmlBody) {
        try {
            java.nio.file.Path path = java.nio.file.Paths.get("last_email_preview.html");
            String content = "<!-- Subject: " + subject + " -->\n" + htmlBody;
            java.nio.file.Files.write(path, content.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            logger.info("Email preview saved to: {}", path.toAbsolutePath());
        } catch (java.io.IOException e) {
            logger.error("Failed to save email preview", e);
        }
    }

    public void sendEnhancedLoginNotification(String to, String fullName) {
        String subject = "Login Successful";
        
        String htmlBody = "<html><body style='font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 30px; border: 1px solid #334155;'>" +
                "<h1 style='color: #38bdf8; margin-top: 0; font-size: 24px;'>⚡ Stockify AI</h1>" +
                "<p style='font-size: 16px; line-height: 1.6; color: #e2e8f0;'>Hello,</p>" +
                "<p style='font-size: 16px; line-height: 1.6; color: #e2e8f0;'>You have successfully logged into your account.</p>" +
                "<p style='font-size: 16px; line-height: 1.6; color: #e2e8f0;'>If this wasn't you, please secure your account immediately.</p>" +
                "<div style='background-color: #0f172a; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #334155;'>" +
                "<table style='width: 100%; border-collapse: collapse;'>" +
                "<tr><td style='padding: 5px 0; color: #94a3b8;'>User:</td><td style='padding: 5px 0; color: #f8fafc; text-align: right;'>" + fullName + "</td></tr>" +
                "<tr><td style='padding: 5px 0; color: #94a3b8;'>Time:</td><td style='padding: 5px 0; color: #f8fafc; text-align: right;'>" + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss")) + "</td></tr>" +
                "</table>" +
                "</div>" +
                "<a href='#' style='background-color: #38bdf8; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;'>Secure My Account</a>" +
                "<hr style='border: 0; border-top: 1px solid #334155; margin: 30px 0;'>" +
                "<p style='font-size: 12px; color: #64748b; text-align: center;'>&copy; 2024 Stockify AI. All rights reserved.</p>" +
                "</div></body></html>";
                
        sendHtmlMessage(to, subject, htmlBody);
    }
}
