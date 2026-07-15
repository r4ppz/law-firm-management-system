/**
 * Nodemailer-based email infrastructure for transactional notifications.
 *
 * Uses Gmail SMTP with an app password. The transporter is lazily
 * initialised on the first call so env vars are only read when needed.
 */

import nodemailer from "nodemailer";

/** Reads a required email env var, throwing a clear error when it is missing. */
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required email environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

/** Assembles the SMTP configuration object from environment variables. */
function getEmailConfig() {
  return {
    host: getRequiredEnvVar("EMAIL_HOST"),
    port: Number(process.env.EMAIL_PORT) || 587,
    user: getRequiredEnvVar("EMAIL_USER"),
    pass: getRequiredEnvVar("EMAIL_PASS"),
    from: getRequiredEnvVar("EMAIL_FROM"),
    secure: process.env.EMAIL_SECURE === "true",
  };
}

/**
 * Creates a Nodemailer transport from a resolved config object.
 *
 * @param config - The SMTP configuration.
 * @returns A configured Nodemailer transport.
 */
function createTransport(config: ReturnType<typeof getEmailConfig>) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
}

let transporter: nodemailer.Transporter;

/** Returns the singleton Nodemailer transporter, creating it on first call. */
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const config = getEmailConfig();
    transporter = createTransport(config);
  }
  return transporter;
}

/** Parameters for sending an email via {@link sendEmail}. */
export interface SendEmailPayload {
  /** Recipient email address(es). */
  to: string | string[];
  /** Email subject line. */
  subject: string;
  /** HTML body content. */
  html: string;
}

/**
 * Sends an email through the configured SMTP transport.
 *
 * @param payload - The recipient, subject, and HTML body.
 */
export async function sendEmail(payload: SendEmailPayload): Promise<void> {
  const config = getEmailConfig();
  await getTransporter().sendMail({
    from: config.from,
    to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}

/**
 * Checks whether the SMTP connection is reachable and authenticated.
 *
 * @returns `true` if the transport verifies successfully, `false` otherwise.
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await getTransporter().verify();
    return true;
  } catch {
    return false;
  }
}
