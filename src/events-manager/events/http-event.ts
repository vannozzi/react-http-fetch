export abstract class HttpEvent<T> {
  /**
   * A payload.
   */
  abstract payload: T;
}
