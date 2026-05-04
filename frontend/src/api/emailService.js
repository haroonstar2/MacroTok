import emailjs from "@emailjs/browser";

//  EmailJS credentials
const SERVICE_ID = "service_oo1jjfh";
const PUBLIC_KEY = "4M39WgkujJgCa5Cta";

const TEMPLATES = {
  accountCreated: "template_2q1l0np",
  accountDeactivated: "",
  accountReactivated: "",
  passwordReset: "template_a3evhns",
  accountDeleted: "",
};

// Internal helper - all emails go through here
function send(templateId, toEmail, toName, subject, message) {
  return emailjs
    .send(
      SERVICE_ID,
      templateId,
      { to_email: toEmail, to_name: toName, subject, message },
      PUBLIC_KEY,
    )
    .catch((err) => {
      console.error("EmailJS error:", err);
    });
}

//  Account Created
export function sendAccountCreatedEmail(user) {
  const name = user.displayName || "there";
  return send(
    TEMPLATES.accountCreated,
    user.email,
    name,
    "Welcome to MacroTok!",
    `Hi ${name},\n\nYour MacroTok account has been successfully created.\n\nStart exploring high-protein recipes, track your macros, and build your meal plan.\n\nWelcome aboard!\nThe MacroTok Team`,
  );
}

//  Account Deactivated ──
export function sendAccountDeactivatedEmail(user) {
  const name = user.displayName || "there";
  return send(
    TEMPLATES.accountDeactivated,
    user.email,
    name,
    "Your MacroTok account has been deactivated",
    `Hi ${name},\n\nYour account has been temporarily deactivated.\n\nYour data is safely stored and nothing has been deleted. You can reactivate your account anytime simply by logging back in.\n\nSee you soon,\nThe MacroTok Team`,
  );
}

//  Account Reactivated
export function sendAccountReactivatedEmail(user) {
  const name = user.displayName || "there";
  return send(
    TEMPLATES.accountReactivated,
    user.email,
    name,
    "Welcome back to MacroTok!",
    `Hi ${name},\n\nGreat news - your MacroTok account has been successfully reactivated.\n\nAll your meal plans, liked recipes, and settings are right where you left them.\n\nWelcome back!\nThe MacroTok Team`,
  );
}

//  Password Reset Sent
export function sendPasswordResetNotificationEmail(user) {
  const name = user.displayName || "there";
  return send(
    TEMPLATES.passwordReset,
    user.email,
    name,
    "Password reset requested for your MacroTok account",
    `Hi ${name},\n\nA password reset link has been sent to ${user.email}.\n\nIf you did not request this, you can safely ignore this message - your account remains secure.\n\nThe MacroTok Team`,
  );
}

//  Account Permanently Deleted
export function sendAccountDeletedEmail(user) {
  const name = user.displayName || "there";
  return send(
    TEMPLATES.accountDeleted,
    user.email,
    name,
    "Your MacroTok account has been deleted",
    `Hi ${name},\n\nYour MacroTok account has been permanently deleted.\n\nAll your data including meal plans, liked recipes, and settings have been removed from our servers.\n\nWe're sad to see you go. If this was a mistake or you change your mind, you're always welcome to create a new account.\n\nThe MacroTok Team`,
  );
}
