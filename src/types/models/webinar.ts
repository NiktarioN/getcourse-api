/** Параметры вебинара */
export interface WebinarParam {
  title: string;
  teaser_description: string;
  show_page_login: number;
}

/** Тип вебинара */
export type WebinarType = 'hangouts' | 'bigbluebutton';

/** Статус вебинара */
export type WebinarStatus = 'new' | 'opened' | 'finished' | 'closed';

/** Вебинар */
export interface Webinar {
  id: number;
  user_id: number;
  name: string;
  status: WebinarStatus;
  created_at: string;
  type: WebinarType;
  subtype: number;
  scenario_id: number;
  disabled_comments: number;
  access_type: number;
  url_redirrect: string;
  slide_id: string;
  view_type: number;
  isolated_chat: number;
  type_schedule: number;
  params: WebinarParam;
}

/** Тип пользователя вебинара */
export type WebinarUserType = 1 | 2;
