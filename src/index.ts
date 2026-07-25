import GetCourse from './getcourse.ts';

export default GetCourse;

export type { CallWebhook } from './types/webhooks/call.ts';

export type {
  DealCreatedWebhook,
  DealPaidWebhook,
  DealStatusChangedWebhook,
} from './types/webhooks/deal.ts';

export type {
  DialogClientMessageWebhook,
  DialogCreatedWebhook,
  DialogReopenedWebhook,
  DialogEmployeeMessageWebhook,
} from './types/webhooks/dialog.ts';

export type {
  HelpdeskClientMessageWebhook,
  HelpdeskEmployeeMessageWebhook,
  HelpdeskTicketCreatedWebhook,
} from './types/webhooks/helpdesk.ts';

export type {
  AnswerCommentCreatedWebhook,
  LessonAnswerCreatedWebhook,
  WebhookCommentFile,
  WebhookCommentFiles,
} from './types/webhooks/lesson.ts';

export type { WebinarCommentCreatedWebhook } from './types/webhooks/webinar.ts';
