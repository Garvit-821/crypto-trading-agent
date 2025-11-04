/**
 * Telegram Bot Service for sending alerts
 * 
 * To use this service, you need:
 * 1. Create a Telegram Bot via @BotFather
 * 2. Get your bot token
 * 3. Get your chat ID from @userinfobot
 * 4. Store these in environment variables or Supabase secrets
 * 
 * For production, this should be implemented as a backend API endpoint
 * to keep your bot token secure.
 */

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export interface TelegramAlert {
  symbol: string;
  assetType: string;
  exchange?: string;
  alertType: string;
  targetPrice?: number;
  currentPrice?: number;
  message?: string;
}

/**
 * Send an alert to Telegram
 * Note: This is a client-side implementation for demo purposes.
 * In production, this should be a server-side API call.
 */
export async function sendTelegramAlert(
  chatId: string,
  alert: TelegramAlert
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram bot token not configured');
    return false;
  }

  const message = formatAlertMessage(alert);

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
    return false;
  }
}

function formatAlertMessage(alert: TelegramAlert): string {
  const symbol = alert.exchange 
    ? `${alert.symbol}.${alert.exchange}` 
    : alert.symbol;

  let message = `🔔 *Price Alert Triggered*\n\n`;
  message += `*Symbol:* ${symbol}\n`;
  message += `*Asset Type:* ${alert.assetType.toUpperCase()}\n`;
  message += `*Alert Type:* ${alert.alertType.replace('_', ' ').toUpperCase()}\n`;

  if (alert.targetPrice) {
    message += `*Target Price:* $${alert.targetPrice.toFixed(4)}\n`;
  }

  if (alert.currentPrice) {
    message += `*Current Price:* $${alert.currentPrice.toFixed(4)}\n`;
  }

  if (alert.message) {
    message += `\n*Message:* ${alert.message}\n`;
  }

  message += `\n_Generated at ${new Date().toLocaleString()}_`;

  return message;
}

/**
 * Verify Telegram bot token and chat ID
 */
export async function verifyTelegramConfig(): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

