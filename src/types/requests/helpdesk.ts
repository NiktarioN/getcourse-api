import type { MessageTransport } from '../models/dialog.ts';

/**
 * Причина закрытия тикета HelpDesk:
 * 1 — по сроку, 2 — клиент доволен, 3 — клиент недоволен,
 * 4 — без причины (не работает почему-то), 5 — нет ответа клиента
 */
export type HelpdeskCloseReason = 1 | 2 | 3 | 4 | 5;

/** Добавить сообщение в тикет HelpDesk */
export interface HelpdeskAddCommentRequest {
  /** ID тикета */
  ticketId: number;
  /** Текст сообщения */
  commentText: string;
  /** Транспорты для отправки */
  transport: MessageTransport[];
  /** ID сотрудника/администратора */
  userId: number;
}

/** Изменить отдел тикета HelpDesk */
export interface HelpdeskChangeDepartmentRequest {
  /** ID тикета */
  ticketId: number;
  /** ID нового отдела */
  newDepartmentId: number;
}

/** Закрыть тикет HelpDesk */
export interface HelpdeskCloseTicketRequest {
  /** ID тикета */
  ticketId: number;
  /** Причина закрытия */
  closedReason: HelpdeskCloseReason;
  /** Комментарий к закрытию, не более 255 символов */
  closedComment?: string;
}

/** Получить историю переписки тикета HelpDesk */
export interface HelpdeskGetHistoryRequest {
  /** ID тикета */
  ticketId: number;
  /** Количество сообщений (не более 1000, по умолчанию: 100) */
  limit?: number;
}
