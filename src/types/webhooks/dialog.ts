import type { DialogDepartment, MessageTransport } from '../models/dialog.ts';

/** Пользователь в теле вебхука диалога */
interface WebhookDialogUser {
  id: number;
  name: string;
  email: string;
}

/** Файл, приложенный к сообщению */
interface WebhookDialogFile {
  url: string;
}

/**
 * Общие поля событий диалога
 *
 * Тикеты HelpDesk приходят с точно такой же структурой, поэтому база переиспользуется
 * в `webhooks/helpdesk.ts` — включая поле `dialog_id`, в котором GetCourse присылает ID тикета
 */
export interface WebhookDialogBase {
  /**
   * Текст сообщения. Может быть пустой строкой
   * У сообщений с вложением обычно подставляется текст вида "Получен файл: <имя>"
   */
  message: string;
  dialog_id: number;
  /** null у сообщений от сотрудника во «Входящих» — в HelpDesk там приходит 0 */
  transport: MessageTransport | null;
  user_data: WebhookDialogUser;
  /** Время сообщения в формате "2026-07-24 11:14:09" — не ISO, в отличие от ts в новых событиях */
  created_at: string;
  department: DialogDepartment;
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

/** Новое сообщение от ученика. Приходит и на создание диалога, и на переоткрытие */
export interface DialogClientMessageWebhook extends WebhookDialogBase {
  event_id: 3;
}

/** Новое сообщение от сотрудника */
export interface DialogEmployeeMessageWebhook extends WebhookDialogBase {
  event_id: 4;
}
