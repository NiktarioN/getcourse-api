import type { MessageAttachment, MessageTransport } from '../models/dialog.ts';

/**
 * Причина закрытия тикета HelpDesk:
 * 1 — по сроку, 2 — клиент доволен, 3 — клиент недоволен,
 * 4 — без причины (не работает почему-то), 5 — нет ответа клиента
 */
export type TicketCloseReason = 1 | 2 | 3 | 4 | 5;

/** Отправить сообщение в тикет HelpDesk от имени сотрудника */
export interface SendTicketMessageRequest {
  /** ID тикета */
  ticketId: number;
  /** Текст сообщения */
  commentText: string;
  /** Транспорты для отправки */
  transport: MessageTransport[];
  /** ID сотрудника/администратора */
  userId: number;
  /** Файлы к сообщению — не больше 5, каждый до 5 МБ */
  attachedFiles?: MessageAttachment[];
}

/** Изменить отдел тикета HelpDesk */
export interface ChangeTicketDepartmentRequest {
  /** ID тикета */
  ticketId: number;
  /** ID нового отдела */
  newDepartmentId: number;
}

/** Закрыть тикет HelpDesk */
export interface CloseTicketRequest {
  /** ID тикета */
  ticketId: number;
  /** Причина закрытия */
  closedReason: TicketCloseReason;
  /** Комментарий к закрытию, не более 255 символов */
  closedComment?: string;
}

/** Получить историю переписки тикета HelpDesk */
export interface GetTicketHistoryRequest {
  /** ID тикета */
  ticketId: number;
  /** Количество сообщений (не более 1000, по умолчанию: 100) */
  limit?: number;
}
