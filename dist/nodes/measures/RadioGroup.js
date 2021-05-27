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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Measure_1 = __importDefault(require("../Measure"));
const outline_icons_1 = require("outline-icons");
const radioGroupMeasuresScaffold = [
    { label: "Star Rating", className: "star", validator: () => true },
    { label: "Likert Rating", className: "likert", validator: () => true },
    { label: "Dropdown Selection", className: "dropdown", validator: () => true },
];
const registerRadioGroupValueMeasureDelegate = ({ className, label, }) => {
    Measure_1.default.registerDelegate(className, {
        label: label,
        builder: (state, { set, attrs }) => {
            return (React.createElement("div", null,
                React.createElement("code", null, JSON.stringify(attrs)),
                React.createElement("button", { onClick: () => set({ enabled: !state.enabled }) }, "Toggle")));
        },
        menuItem: {
            icon: outline_icons_1.BulletedListIcon,
            keywords: `measure radio group ${className}`,
        },
    });
};
radioGroupMeasuresScaffold.forEach((_a) => {
    var props = __rest(_a, []);
    return registerRadioGroupValueMeasureDelegate(props);
});
//# sourceMappingURL=RadioGroup.js.map