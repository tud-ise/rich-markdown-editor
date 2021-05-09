import { wrappingInputRule } from "prosemirror-inputrules";
import { Node as ProsemirrorNode } from "prosemirror-model";
import toggleWrap from "../commands/toggleWrap";
import Node from "./Node";
import { BeakerIcon } from "outline-icons";
import * as React from "react";
import ReactDOM from "react-dom";
import { MenuItem, DeferredReactRenderer } from "../types";

export type MeasureOptions = {
  readOnly: boolean;
};

export type MeasureBuilder<
  O extends Record<string, unknown>,
  T extends ProsemirrorNode["attrs"]["state"]
> = {
  label: string;
  className: string;
  iconBuilder?: DeferredReactRenderer<O, T>;
  builder: DeferredReactRenderer<O, T>;
  menuItem: Omit<MenuItem, "title" | "attrs">;
};

export default class Measure extends Node {
  private static readonly delegates: Record<
    string,
    MeasureBuilder<MeasureOptions, ProsemirrorNode["attrs"]["state"]>
  > = {};
  static registerDelegate<T extends ProsemirrorNode["attrs"]["state"]>(
    className: string,
    node: Omit<MeasureBuilder<MeasureOptions, T>, "className">
  ): void {
    Measure.delegates[className] = {
      className: className,
      ...node,
    };
  }

  static get blockMenuItems(): MenuItem[] {
    return Object.entries(Measure.delegates).map(
      ([key, { label, menuItem }]) => ({
        ...menuItem,
        name: "container_measure",
        title: label,
        attrs: {
          child: key,
        },
      })
    );
  }

  get name(): string {
    return "container_measure";
  }

  get schema(): any {
    return {
      attrs: {
        child: {
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
          getAttrs: (dom: HTMLDivElement) => ({
            child: Object.keys(Measure.delegates).reduce(
              (v, k) => (v !== null ? v : dom.className.includes(k) ? k : v),
              undefined
            ),
          }),
        },
      ],
      toDOM: (node: ProsemirrorNode) => {
        const select = document.createElement("select");
        select.addEventListener(
          "change",
          this.buildHandleChildChange(node.attrs)
        );

        Object.entries(Measure.delegates).forEach(([key, { label }]) => {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = label;
          option.selected = node.attrs.child === key;
          select.appendChild(option);
        });

        let controls;
        const controlsContainer = document.createElement("div");
        Object.entries(Measure.delegates).forEach(([key, { builder }]) => {
          if (node.attrs.child === key) {
            controls = builder(
              node.attrs.state || {},
              {
                attrs: node.attrs,
                set: this.buildHandleSetState(
                  controlsContainer,
                  node.attrs
                ) as any,
              },
              this.options as any
            );
          }
        });
        ReactDOM.render(controls, controlsContainer);

        let icon = <BeakerIcon color="currentColor" />;
        const iconContainer = document.createElement("div");
        Object.entries(Measure.delegates).forEach(([key, { iconBuilder }]) => {
          if (node.attrs.child === key && iconBuilder) {
            icon = iconBuilder(
              node.attrs.state || {},
              {
                attrs: node.attrs,
                set: this.buildHandleSetState(iconContainer, node.attrs) as any,
              },
              this.options as any
            );
          }
        });

        iconContainer.className = "icon";
        ReactDOM.render(icon, iconContainer);

        return [
          "div",
          { class: `measure-block ${node.attrs.child}` },
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
    return attrs => toggleWrap(type, attrs);
  }

  buildHandleChildChange = (attrs = {}) => event => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        ...attrs,
        child: element.value,
      });
      view.dispatch(transaction);
    }
  };

  buildHandleSetState = (target: HTMLElement, attrs: { state?: any } = {}) => (
    state: any | ((s: any) => any)
  ) => {
    const { view } = this.editor;
    const { tr } = view.state;
    const { top, left } = target.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (!result) {
      return;
    }

    const update = {
      ...attrs,
      state: typeof state === "function" ? state(attrs.state || {}) : state,
    };

    const transaction = tr.setNodeMarkup(result.inside, undefined, update);
    view.dispatch(transaction);
  };

  inputRules({ type }) {
    return [wrappingInputRule(/^:::\{(measure)\}$/, type)];
  }

  toMarkdown(state, node) {
    state.write(
      "\n:::{measure}{" +
        (node.attrs.child || Object.entries(Measure.delegates)[0][0]) +
        "}" +
        JSON.stringify(node.attrs.state || {}) +
        "\n"
    );
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
          child: matches[1],
          state: JSON.parse(`{${matches[2] || ""}}`),
        };
      },
    };
  }
}
