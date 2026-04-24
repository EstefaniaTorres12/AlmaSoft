const nodemailer = require("nodemailer");

function createTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function sendCashPaymentEmail({
  to,
  clientName,
  planName,
  amount,
  dueDate,
  contractId,
}) {
  const transport = createTransport();

  if (!transport || !to) {
    return {
      sent: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = "Instrucciones de pago en efectivo - AlmaSoft";
  const text = [
    `Hola ${clientName || "cliente"},`,
    "",
    "Tu solicitud de plan fue registrada con pago en efectivo.",
    `Plan: ${planName}`,
    `Valor: ${amount}`,
    `Fecha limite de pago: ${dueDate}`,
    `Contrato: ${contractId}`,
    "",
    "Acercate a una sede con este correo para realizar el pago.",
    "",
    "Gracias por confiar en AlmaSoft.",
  ].join("\n");

  await transport.sendMail({
    from,
    to,
    subject,
    text,
  });

  return { sent: true };
}

module.exports = {
  sendCashPaymentEmail,
};
