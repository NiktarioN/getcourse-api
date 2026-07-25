import type { DialogTransport } from '../models/dialog.ts';

/** Добавить комментарий в диалог */
export interface AddCommentToDialogRequest {
  /** ID диалога */
  dialogId: number;
  /** Текст комментария */
  commentText: string;
  /** Транспорты для отправки */
  transport: DialogTransport[];
  /** ID сотрудника/администратора */
  userId: number;
}

/** Изменить отдел диалога */
export interface ChangeDepartmentRequest {
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
export interface AddNoteRequest {
  /** ID диалога */
  dialogId: number;
  /** Текст заметки */
  text: string;
}
