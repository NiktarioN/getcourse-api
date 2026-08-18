import type { MessageAttachment, MessageTransport } from '../models/dialog.ts';

/** Общие поля сообщения в диалог */
interface DialogMessageBase {
  /** Текст сообщения */
  commentText: string;
  /** Транспорты для отправки */
  transport: MessageTransport[];
  /** ID сотрудника/администратора */
  userId: number;
  /** Файлы к сообщению — не больше 5, каждый до 5 МБ */
  attachedFiles?: MessageAttachment[];
}

/** Отправить сообщение в диалог от имени сотрудника */
export interface SendDialogMessageRequest extends DialogMessageBase {
  /** ID диалога */
  dialogId: number;
}

/** Начать диалог с учеником от имени сотрудника */
export interface StartDialogRequest extends DialogMessageBase {
  /** ID ученика */
  recipientId: number;
}

/** Изменить отдел диалога */
export interface ChangeDialogDepartmentRequest {
  /** ID диалога */
  dialogId: number;
  /** ID нового отдела */
  newDepartmentId: number;
}

/** Закрыть диалог */
export interface CloseDialogRequest {
  /** ID диалога */
  dialogId: number;
}

/** Получить историю диалога */
export interface GetDialogHistoryRequest {
  /** ID диалога */
  dialogId: number;
  /** Количество сообщений (не более 1000, по умолчанию: 100) */
  limit?: number;
}

/** Добавить заметку к диалогу */
export interface AddDialogNoteRequest {
  /** ID диалога */
  dialogId: number;
  /** Текст заметки */
  text: string;
}
