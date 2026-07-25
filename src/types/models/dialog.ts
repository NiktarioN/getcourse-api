/** Сообщение из истории диалога */
export interface DialogMessage {
  message_id: number;
  created_at: string;
  user_id: number;
  message_type: string;
  user_type: string;
  department: {
    id: number;
    title: string;
  };
  attached_files: { url: string }[] | null;
  transport: (DialogTransport | null)[] | null;
  comment_text: string;
}

/**
 * Транспорт сообщения диалога:
 * 0 - Платформа, 1 - Email, 2 - SMS, 3 - Telegram, 4 - Facebook,
 * 5 - VK, 6 - Chatium, 7 - Whatsapp, 8 - Viber, 13 - MAX
 */
export type DialogTransport = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 13;
