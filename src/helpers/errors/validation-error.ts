import GetCourseError from './error.ts';

import type { ValidationErrorDetails } from '../../types/common.ts';

export default class GetCourseValidationError extends GetCourseError {
  readonly details: ValidationErrorDetails;

  constructor(params: { message: string; details: ValidationErrorDetails }) {
    super(params.message);
    this.name = 'GetCourseValidationError';
    this.details = params.details;
  }
}
