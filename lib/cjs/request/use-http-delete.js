"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHttpDelete = void 0;
var _1 = require(".");
var enum_1 = require("../enum");
var use_overrided_params_by_method_1 = require("./use-overrided-params-by-method");
var useHttpDelete = function (params) {
    var overridedParams = (0, use_overrided_params_by_method_1.useOverridedParamsByMethod)(params, enum_1.HttpMethod.Delete);
    return (0, _1.useHttpRequest)(overridedParams);
};
exports.useHttpDelete = useHttpDelete;