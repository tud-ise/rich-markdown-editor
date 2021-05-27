import * as React from "react";
import { EditorState } from "prosemirror-state";
import { Node } from "prosemirror-model";
import base from "../dictionary";
export declare enum ToastType {
    Error = "error",
    Info = "info"
}
export declare type MenuItem = {
    icon?: typeof React.Component | React.FC<any>;
    name?: string;
    title?: string;
    shortcut?: string;
    keywords?: string;
    tooltip?: string;
    defaultHidden?: boolean;
    attrs?: Record<string, any>;
    visible?: boolean;
    active?: (state: EditorState) => boolean;
};
export declare type EmbedDescriptor = MenuItem & {
    matcher: (url: string) => boolean | [] | RegExpMatchArray;
    component: typeof React.Component | React.FC<any>;
};
export declare type DeferredReactRenderer<O extends Record<string, unknown>, T extends Node["attrs"]["state"]> = (state: T, props: {
    attrs: Node["attrs"];
    set: (s: T | ((s: T) => T)) => void;
}, options: Partial<typeof base> & O) => JSX.Element;
//# sourceMappingURL=index.d.ts.map