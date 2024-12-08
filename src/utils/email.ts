import emailjs from '@emailjs/browser';

export const sendEmail = async (
  templateParams: Record<string, unknown>,
  serviceId: string,
  templateId: string,
  publicKey: string
): Promise<void> => {
  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

export const createMailtoLink = (
  email: string,
  subject: string,
  body: string
): string => {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};