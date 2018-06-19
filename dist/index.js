"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const EnvParser_1 = require("./parsers/EnvParser");
exports.Config = Config_1.default;
exports.parsers = {
    EnvParser: EnvParser_1.default,
};
