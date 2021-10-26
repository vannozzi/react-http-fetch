import { AbortableHttpRequestReturn, UseHttpClientReturn } from './types';
import { HttpRequestInfo, PerformHttpRequestParams } from '.';
import { useCallback } from 'react';
import {
  RequestErroredEvent,
  RequestStartedEvent,
  RequestSuccededEvent,
  useEventBus,
} from '../events-manager';
import { useHttpClientConfig } from '../config';
import { HttpError, HttpMethod } from '..';

export const useHttpClient = (): UseHttpClientReturn => {
  /**
   * The http client config.
   */
  const {
    config: { reqOptions: defaultOptions, responseParser, requestBodySerializer, baseUrl },
  } = useHttpClientConfig();

  /**
   * The event bus.
   */
  const eventBus = useEventBus();

  /**
   * Perform a fetch request allowing to observe the response stream.
   */
  const request = useCallback(
    async <HttpResponse>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
    }: PerformHttpRequestParams): Promise<HttpResponse> => {
      /**
       * Compose the request data.
       */
      const computedBaseUrl = baseUrlOverride || baseUrl;
      const url = `${computedBaseUrl}/${relativeUrl}`;

      const { body, method, headers = {}, credentials, signal } = requestOptions || {};
      const mergedOptions = {
        method: method || defaultOptions.method,
        credentials: credentials || defaultOptions.credentials,
        signal,
        headers: {
          ...defaultOptions.headers,
          ...headers,
        },
        body: body ? requestBodySerializer(body) : null,
      };

      /**
       * Encapsulate all request info.
       */
      const requestInfo: HttpRequestInfo = {
        url,
        ...mergedOptions,
      };

      try {
        /**
         * Publish the event to tell a new request started.
         */
        const requestStartedEvent = new RequestStartedEvent(requestInfo);
        eventBus.publish(requestStartedEvent);

        /**
         * Perform the request.
         */
        const response: Response = await fetch(url, mergedOptions);

        /**
         * Handle any errors different than the network ones
         * (e.g. 4xx and 5xx are not network errors).
         */
        if (!response.ok) {
          const { status, statusText } = response;
          const httpError = new HttpError(
            statusText || 'Http Error',
            status,
            requestInfo,
            statusText
          );
          const requestErroredEvent = new RequestErroredEvent(httpError);
          eventBus.publish(requestErroredEvent);

          return Promise.reject(httpError);
        }

        /**
         * Apply the response parser.
         */
        const computedParser = parser || responseParser;
        const parsedResponse = (
          computedParser ? computedParser<HttpResponse>(response) : response
        ) as Promise<HttpResponse>;

        /**
         * Publish an event to tell the request succeded.
         */
        const requestSuccededEvent = new RequestSuccededEvent({
          request: requestInfo,
          response: parsedResponse,
        });
        eventBus.publish(requestSuccededEvent);

        return parsedResponse;
      } catch (error) {
        const httpError = new HttpError(
          error?.message || 'Http Error',
          error?.status || undefined,
          requestInfo
        );
        /**
         * Publish an event to tell the request errored.
         */
        const requestErroredEvent = new RequestErroredEvent(httpError);
        eventBus.publish(requestErroredEvent);

        return Promise.reject(error);
      }
    },
    [baseUrl, defaultOptions, requestBodySerializer, eventBus, responseParser]
  );

  /**
   * Performs an abortable fetch request.
   */
  const abortableRequest = useCallback(
    <HttpResponse>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
    }: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const requestPromise = request<HttpResponse>({
        baseUrlOverride,
        parser,
        relativeUrl,
        requestOptions: {
          ...requestOptions,
          signal,
        },
      });

      return [requestPromise, abortController];
    },
    [request]
  );

  /**
   * Override the http method of the provided request params.
   */
  const overrideHttpMethod = useCallback(
    (params: PerformHttpRequestParams, method: HttpMethod): PerformHttpRequestParams => {
      const { baseUrlOverride, parser, relativeUrl, requestOptions } = params;

      const overridedParams: PerformHttpRequestParams = {
        baseUrlOverride,
        parser,
        relativeUrl,
        requestOptions: {
          ...requestOptions,
          method,
        },
      };

      return overridedParams;
    },
    []
  );

  /**
   * Perform a http request with the given http method.
   */
  const requestByMethod = useCallback(
    async <HttpResponse>(
      params: PerformHttpRequestParams,
      method: HttpMethod
    ): Promise<HttpResponse> => {
      const overridedParams: PerformHttpRequestParams = overrideHttpMethod(params, method);
      return request<HttpResponse>(overridedParams);
    },
    [request, overrideHttpMethod]
  );

  /**
   * Performs a get http request.
   */
  const get = useCallback(
    async <HttpResponse>(params: PerformHttpRequestParams): Promise<HttpResponse> => {
      return requestByMethod(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Performs a post http request.
   */
  const post = useCallback(
    async <HttpResponse>(params: PerformHttpRequestParams): Promise<HttpResponse> => {
      return requestByMethod(params, HttpMethod.Post);
    },
    [requestByMethod]
  );

  /**
   * Performs a put http request.
   */
  const put = useCallback(
    async <HttpResponse>(params: PerformHttpRequestParams): Promise<HttpResponse> => {
      return requestByMethod(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Performs a patch http request.
   */
  const patch = useCallback(
    async <HttpResponse>(params: PerformHttpRequestParams): Promise<HttpResponse> => {
      return requestByMethod(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Performs a delete http request.
   */
  const deleteReq = useCallback(
    async <HttpResponse>(params: PerformHttpRequestParams): Promise<HttpResponse> => {
      return requestByMethod(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Perform a http request with the given http method.
   */
  const abortableRequestByMethod = useCallback(
    <HttpResponse>(
      params: PerformHttpRequestParams,
      method: HttpMethod
    ): AbortableHttpRequestReturn<HttpResponse> => {
      const overridedParams: PerformHttpRequestParams = overrideHttpMethod(params, method);
      return abortableRequest<HttpResponse>(overridedParams);
    },
    [abortableRequest, overrideHttpMethod]
  );

  /**
   * Performs an abortable http get vrequest.
   */
  const abortableGet = useCallback(
    <HttpResponse>(params: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      return abortableRequestByMethod<HttpResponse>(params, HttpMethod.Get);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http post request.
   */
  const abortablePost = useCallback(
    <HttpResponse>(params: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      return abortableRequestByMethod<HttpResponse>(params, HttpMethod.Post);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http patch request.
   */
  const abortablePatch = useCallback(
    <HttpResponse>(params: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      return abortableRequestByMethod<HttpResponse>(params, HttpMethod.Patch);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http put request.
   */
  const abortablePut = useCallback(
    <HttpResponse>(params: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      return abortableRequestByMethod<HttpResponse>(params, HttpMethod.Put);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http delete request.
   */
  const abortableDelete = useCallback(
    <HttpResponse>(params: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      return abortableRequestByMethod<HttpResponse>(params, HttpMethod.Delete);
    },
    [abortableRequestByMethod]
  );

  return {
    request,
    abortableRequest,
    get,
    post,
    put,
    patch,
    deleteReq,
    abortableGet,
    abortablePost,
    abortableDelete,
    abortablePut,
    abortablePatch,
  };
};
