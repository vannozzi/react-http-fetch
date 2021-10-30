var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { HttpRequest } from '.';
import { useCallback } from 'react';
import { RequestErroredEvent, RequestStartedEvent, RequestSuccededEvent, useEventBus, } from '../events-manager';
import { useHttpClientConfig } from '../config';
import { HttpError, HttpMethod } from '..';
export var useHttpClient = function () {
    /**
     * The http client config.
     */
    var _a = useHttpClientConfig().config, defaultOptions = _a.reqOptions, responseParser = _a.responseParser, requestBodySerializer = _a.requestBodySerializer, baseUrl = _a.baseUrl;
    /**
     * The event bus.
     */
    var eventBus = useEventBus();
    /**
     * Perform a fetch request allowing to observe the response stream.
     */
    var request = useCallback(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, parser = _a.parser, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
        return __awaiter(void 0, void 0, void 0, function () {
            var computedBaseUrl, url, _b, body, method, _c, headers, credentials, signal, maxAge, queryParams, mergedOptions, requestInfo, requestStartedEvent, response, status_1, statusText, httpError, requestErroredEvent, computedParser, parsedResponse, requestSuccededEvent, error_1, httpError, requestErroredEvent;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        computedBaseUrl = baseUrlOverride || baseUrl;
                        url = computedBaseUrl + "/" + relativeUrl;
                        _b = requestOptions || {}, body = _b.body, method = _b.method, _c = _b.headers, headers = _c === void 0 ? {} : _c, credentials = _b.credentials, signal = _b.signal, maxAge = _b.maxAge, queryParams = _b.queryParams;
                        mergedOptions = {
                            method: method || defaultOptions.method || HttpMethod.Get,
                            credentials: credentials || defaultOptions.credentials,
                            signal: signal,
                            headers: __assign(__assign({}, defaultOptions.headers), headers),
                            body: body && requestBodySerializer(body),
                            maxAge: maxAge || 0,
                            queryParams: queryParams,
                        };
                        requestInfo = new HttpRequest(__assign(__assign({}, mergedOptions), { baseUrl: computedBaseUrl, relativeUrl: relativeUrl }));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        requestStartedEvent = new RequestStartedEvent(requestInfo);
                        eventBus.publish(requestStartedEvent);
                        return [4 /*yield*/, fetch(url, mergedOptions)];
                    case 2:
                        response = _d.sent();
                        /**
                         * Handle any errors different than the network ones
                         * (e.g. 4xx and 5xx are not network errors).
                         */
                        if (!response.ok) {
                            status_1 = response.status, statusText = response.statusText;
                            httpError = new HttpError(statusText || 'Http Error', status_1, requestInfo, statusText);
                            requestErroredEvent = new RequestErroredEvent(httpError);
                            eventBus.publish(requestErroredEvent);
                            return [2 /*return*/, Promise.reject(httpError)];
                        }
                        computedParser = parser || responseParser;
                        parsedResponse = (computedParser ? computedParser(response) : response);
                        requestSuccededEvent = new RequestSuccededEvent({
                            request: requestInfo,
                            response: parsedResponse,
                        });
                        eventBus.publish(requestSuccededEvent);
                        return [2 /*return*/, parsedResponse];
                    case 3:
                        error_1 = _d.sent();
                        httpError = new HttpError((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Http Error', (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) || undefined, requestInfo);
                        requestErroredEvent = new RequestErroredEvent(httpError);
                        eventBus.publish(requestErroredEvent);
                        return [2 /*return*/, Promise.reject(error_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [baseUrl, defaultOptions, requestBodySerializer, eventBus, responseParser]);
    /**
     * Performs an abortable fetch request.
     */
    var abortableRequest = useCallback(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, parser = _a.parser, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
        var abortController = new AbortController();
        var signal = abortController.signal;
        var requestPromise = request({
            baseUrlOverride: baseUrlOverride,
            parser: parser,
            relativeUrl: relativeUrl,
            requestOptions: __assign(__assign({}, requestOptions), { signal: signal }),
        });
        return [requestPromise, abortController];
    }, [request]);
    /**
     * Override the http method of the provided request params.
     */
    var overrideHttpMethod = useCallback(function (params, method) {
        var baseUrlOverride = params.baseUrlOverride, parser = params.parser, relativeUrl = params.relativeUrl, requestOptions = params.requestOptions;
        var overridedParams = {
            baseUrlOverride: baseUrlOverride,
            parser: parser,
            relativeUrl: relativeUrl,
            requestOptions: __assign(__assign({}, requestOptions), { method: method }),
        };
        return overridedParams;
    }, []);
    /**
     * Perform a http request with the given http method.
     */
    var requestByMethod = useCallback(function (params, method) { return __awaiter(void 0, void 0, void 0, function () {
        var overridedParams;
        return __generator(this, function (_a) {
            overridedParams = overrideHttpMethod(params, method);
            return [2 /*return*/, request(overridedParams)];
        });
    }); }, [request, overrideHttpMethod]);
    /**
     * Performs a get http request.
     */
    var get = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, requestByMethod(params, HttpMethod.Get)];
        });
    }); }, [requestByMethod]);
    /**
     * Performs a post http request.
     */
    var post = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, requestByMethod(params, HttpMethod.Post)];
        });
    }); }, [requestByMethod]);
    /**
     * Performs a put http request.
     */
    var put = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, requestByMethod(params, HttpMethod.Get)];
        });
    }); }, [requestByMethod]);
    /**
     * Performs a patch http request.
     */
    var patch = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, requestByMethod(params, HttpMethod.Get)];
        });
    }); }, [requestByMethod]);
    /**
     * Performs a delete http request.
     */
    var deleteReq = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, requestByMethod(params, HttpMethod.Get)];
        });
    }); }, [requestByMethod]);
    /**
     * Perform a http request with the given http method.
     */
    var abortableRequestByMethod = useCallback(function (params, method) {
        var overridedParams = overrideHttpMethod(params, method);
        return abortableRequest(overridedParams);
    }, [abortableRequest, overrideHttpMethod]);
    /**
     * Performs an abortable http get vrequest.
     */
    var abortableGet = useCallback(function (params) {
        return abortableRequestByMethod(params, HttpMethod.Get);
    }, [abortableRequestByMethod]);
    /**
     * Performs an abortable http post request.
     */
    var abortablePost = useCallback(function (params) {
        return abortableRequestByMethod(params, HttpMethod.Post);
    }, [abortableRequestByMethod]);
    /**
     * Performs an abortable http patch request.
     */
    var abortablePatch = useCallback(function (params) {
        return abortableRequestByMethod(params, HttpMethod.Patch);
    }, [abortableRequestByMethod]);
    /**
     * Performs an abortable http put request.
     */
    var abortablePut = useCallback(function (params) {
        return abortableRequestByMethod(params, HttpMethod.Put);
    }, [abortableRequestByMethod]);
    /**
     * Performs an abortable http delete request.
     */
    var abortableDelete = useCallback(function (params) {
        return abortableRequestByMethod(params, HttpMethod.Delete);
    }, [abortableRequestByMethod]);
    return {
        request: request,
        abortableRequest: abortableRequest,
        get: get,
        post: post,
        put: put,
        patch: patch,
        deleteReq: deleteReq,
        abortableGet: abortableGet,
        abortablePost: abortablePost,
        abortableDelete: abortableDelete,
        abortablePut: abortablePut,
        abortablePatch: abortablePatch,
    };
};