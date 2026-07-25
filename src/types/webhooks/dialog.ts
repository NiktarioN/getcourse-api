import type { DialogTransport } from '../models/dialog.ts';

/** Пользователь в теле вебхука диалога */
interface WebhookDialogUser {
  id: number;
  name: string;
  email: string;
}

/** Отдел, в котором находится диалог */
interface WebhookDialogDepartment {
  id: number;
  title: string;
}

/** Файл, приложенный к сообщению */
interface WebhookDialogFile {
  url: string;
}

/** Общие поля событий диалога */
interface WebhookDialogBase {
  /**
   * Текст сообщения. Может быть пустой строкой
   * У сообщений с вложением GetCourse обычно подставляет текст вида "Получен файл: <имя>"
   */
  message: string;
  dialog_id: number;
  transport: DialogTransport;
  user_data: WebhookDialogUser;
  /** Время сообщения в формате "2026-07-24 11:14:09" — не ISO, в отличие от ts в новых событиях */
  created_at: string;
  department: WebhookDialogDepartment;
  message_id: number;
  /** Всегда массив, при отсутствии файлов — пустой */
  attached_files: WebhookDialogFile[];
  /** null, если ответственный за диалог не назначен */
  personal_manager_id: number | null;
}

/** Создан новый диалог */
export interface DialogCreatedWebhook extends WebhookDialogBase {
  event_id: 1;
}

/** Диалог переоткрыт */
export interface DialogReopenedWebhook extends WebhookDialogBase {
  event_id: 2;
}

/** Новое сообщение в диалоге. Приходит и на создание диалога, и на переоткрытие */
export interface DialogMessageWebhook extends WebhookDialogBase {
  event_id: 3;
}
