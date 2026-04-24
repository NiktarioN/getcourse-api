/**
 * Базовый класс ошибок SDK
 */
export default class GetCourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GetCourseError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
