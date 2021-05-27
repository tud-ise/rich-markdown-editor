"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
function measure(md) {
    return markdown_it_container_1.default(md, "measure", {
        marker: ":",
        validate: (params) => params.trim().match(/^{measure}{(\w+)}(?:{(.*)})?$/gm),
        render: function (tokens, idx) {
            const { info } = tokens[idx];
            if (tokens[idx].nesting === 1) {
                return `<div class="measure-block ${md.utils.escapeHtml(info)}">\n`;
            }
            else {
                return "</div>\n";
            }
        },
    });
}
exports.default = measure;
//# sourceMappingURL=measures.js.map