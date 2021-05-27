"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const toggleWrap_1 = __importDefault(require("../commands/toggleWrap"));
const Node_1 = __importDefault(require("./Node"));
const outline_icons_1 = require("outline-icons");
const React = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
class Measure extends Node_1.default {
    constructor() {
        super(...arguments);
        this.buildHandleComponentChange = (attrs = {}) => event => {
            const { view } = this.editor;
            const { tr } = view.state;
            const element = event.target;
            const { top, left } = element.getBoundingClientRect();
            const result = view.posAtCoords({ top, left });
            if (result) {
                const transaction = tr.setNodeMarkup(result.inside, undefined, Object.assign(Object.assign({}, attrs), { component: element.value }));
                view.dispatch(transaction);
            }
        };
        this.buildHandleSetState = (target, attrs = {}) => (state) => {
            const { view } = this.editor;
            const { tr } = view.state;
            const { top, left } = target.getBoundingClientRect();
            const result = view.posAtCoords({ top, left });
            if (!result) {
                return;
            }
            const update = Object.assign(Object.assign({}, attrs), { state: typeof state === "function" ? state(attrs.state || {}) : state });
            const transaction = tr.setNodeMarkup(result.inside, undefined, update);
            view.dispatch(transaction);
        };
    }
    static registerDelegate(className, node) {
        Measure.delegates[className] = Object.assign({ className: className }, node);
    }
    static get blockMenuItems() {
        return Object.entries(Measure.delegates).map(([key, { label, menuItem }]) => (Object.assign(Object.assign({}, menuItem), { name: "container_measure", title: label, attrs: {
                component: key,
            } })));
    }
    get name() {
        return "container_measure";
    }
    get schema() {
        return {
            attrs: {
                component: {
                    default: Object.entries(Measure.delegates)[0][0],
                },
                state: {
                    default: {},
                },
            },
            content: "block+",
            group: "block",
            defining: true,
            draggable: true,
            parseDOM: [
                {
                    tag: "div.measure-block",
                    preserveWhitespace: "full",
                    contentElement: "div:last-child",
                    getAttrs: (dom) => ({
                        component: Object.keys(Measure.delegates).reduce((v, k) => (v !== null ? v : dom.className.includes(k) ? k : v), undefined),
                    }),
                },
            ],
            toDOM: (node) => {
                const select = document.createElement("select");
                select.addEventListener("change", this.buildHandleComponentChange(node.attrs));
                Object.entries(Measure.delegates).forEach(([key, { label }]) => {
                    const option = document.createElement("option");
                    option.value = key;
                    option.innerText = label;
                    option.selected = node.attrs.component === key;
                    select.appendChild(option);
                });
                let controls;
                const controlsContainer = document.createElement("div");
                Object.entries(Measure.delegates).forEach(([key, { builder }]) => {
                    if (node.attrs.component === key) {
                        controls = builder(node.attrs.state || {}, {
                            attrs: node.attrs,
                            set: this.buildHandleSetState(controlsContainer, node.attrs),
                        }, this.options);
                    }
                });
                react_dom_1.default.render(controls, controlsContainer);
                let icon = React.createElement(outline_icons_1.BeakerIcon, { color: "currentColor" });
                const iconContainer = document.createElement("div");
                Object.entries(Measure.delegates).forEach(([key, { iconBuilder }]) => {
                    if (node.attrs.component === key && iconBuilder) {
                        icon = iconBuilder(node.attrs.state || {}, {
                            attrs: node.attrs,
                            set: this.buildHandleSetState(iconContainer, node.attrs),
                        }, this.options);
                    }
                });
                iconContainer.className = "icon";
                react_dom_1.default.render(icon, iconContainer);
                return [
                    "div",
                    { class: `measure-block ${node.attrs.component}` },
                    ["div", { contentEditable: false }, select],
                    [
                        "div",
                        { style: "display:flex;flex-direction:row;" },
                        iconContainer,
                        ["div", { class: "content" }, 0],
                    ],
                    [
                        "div",
                        { class: "controls", contentEditable: false },
                        controlsContainer,
                    ],
                ];
            },
        };
    }
    commands({ type }) {
        return attrs => toggleWrap_1.default(type, attrs);
    }
    inputRules({ type }) {
        return [prosemirror_inputrules_1.wrappingInputRule(/^:::\{(measure)\}$/, type)];
    }
    toMarkdown(state, node) {
        state.write("\n:::{measure}{" +
            (node.attrs.component || Object.entries(Measure.delegates)[0][0]) +
            "}" +
            JSON.stringify(node.attrs.state || {}) +
            "\n");
        state.renderContent(node);
        state.ensureNewLine();
        state.write(":::");
        state.closeBlock(node);
    }
    parseMarkdown() {
        return {
            block: "container_measure",
            getAttrs: tok => {
                const matches = tok.info.match(/^{measure}{(\w+)}(?:{(.*)})?$/);
                return {
                    component: matches[1],
                    state: JSON.parse(`{${matches[2] || ""}}`),
                };
            },
        };
    }
}
exports.default = Measure;
Measure.delegates = {};
//# sourceMappingURL=Measure.js.map