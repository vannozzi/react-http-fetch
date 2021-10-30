import { HttpRequest } from '../..';
import { HttpEvent } from './http-event';
export declare class RequestStartedEvent extends HttpEvent<HttpRequest> {
    /**
     * @inheritdoc
     */
    payload: HttpRequest;
    constructor(payload: HttpRequest);
}