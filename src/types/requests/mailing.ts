import type { PaginationParams } from '../common.ts';
import type { MailingTransport, MailingType } from '../models/mailing.ts';

/** Получить статистику рассылок */
export interface GetMailingStatsRequest extends PaginationParams {
  /** ID категории рассылки */
  categoryId?: number;
  /** Транспорт рассылки. Неизвестное значение GetCourse отклоняет с HTTP 400 `Transport is not found` */
  transport?: MailingTransport;
  /** Тип рассылки */
  type?: MailingType;
  /**
   * ID рассылок
   *
   * Пустой массив не фильтрует — вернётся первая страница рассылок, по умолчанию 100.
   * Список уходит в URL: 300 восьмизначных ID проходят, на 500 GetCourse отвечает HTTP 414
   */
  ids?: number[];
}

/** Получить рассылки */
export interface GetMailingsRequest extends GetMailingStatsRequest {
  /** Название рассылки — поиск по подстроке, без учёта регистра */
  title?: string;
  /** ID родительской рассылки */
  parentId?: number;
}
