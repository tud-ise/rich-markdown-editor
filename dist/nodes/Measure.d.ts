import { Node as ProsemirrorNode } from "prosemirror-model";
import Node from "./Node";
import { MenuItem, DeferredReactRenderer } from "../types";
export declare type MeasureOptions = {
    readOnly: boolean;
};
export declare type MeasureBuilder<O extends Record<string, unknown>, T extends ProsemirrorNode["attrs"]["state"]> = {
    label: string;
    className: string;
    iconBuilder?: DeferredReactRenderer<O, T>;
    builder: DeferredReactRenderer<O, T>;
    menuItem: Omit<MenuItem, "title" | "attrs">;
};
export default class Measure extends Node {
    private static readonly delegates;
    static registerDelegate<T extends ProsemirrorNode["attrs"]["state"]>(className: string, node: Omit<MeasureBuilder<MeasureOptions, T>, "className">): void;
    static get blockMenuItems(): MenuItem[];
    get name(): string;
    get schema(): any;
    commands({ type }: {
        type: any;
    }): (attrs: any) => (state: any, dispatch: any) => boolean;
    buildHandleComponentChange: (attrs?: {}) => (event: any) => void;
    buildHandleSetState: (target: HTMLElement, attrs?: {
        state?: any;
    }) => (state: any) => void;
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
        getAttrs: (tok: any) => {
            component: any;
            state: any;
        };
    };
}
//# sourceMappingURL=Measure.d.ts.map