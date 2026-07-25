import GetCourse from './getcourse.ts';

export default GetCourse;

export type { CallWebhook } from './types/webhooks/call.ts';

export type {
  AnswerCommentCreatedWebhook,
  WebhookCommentFile,
  WebhookCommentFiles,
} from './types/webhooks/comment.ts';

export type {
  DealCreatedWebhook,
  DealPaidWebhook,
  DealStatusChangedWebhook,
} from './types/webhooks/deal.ts';

export type {
  DialogCreatedWebhook,
  DialogMessageWebhook,
  DialogReopenedWebhook,
} from './types/webhooks/dialog.ts';

export type { LessonAnswerCreatedWebhook } from './types/webhooks/lesson.ts';

export type { WebinarCommentCreatedWebhook } from './types/webhooks/webinar.ts';
