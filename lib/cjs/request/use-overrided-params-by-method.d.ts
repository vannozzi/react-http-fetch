import { HttpMethod } from '../enum';
import { UseHttpRequestParams } from './types';
export declare const useOverridedParamsByMethod: <HttpResponse>(params: UseHttpRequestParams<HttpResponse>, method: HttpMethod) => UseHttpRequestParams<HttpResponse>;