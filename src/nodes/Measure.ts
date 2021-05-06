import { wrappingInputRule } from "prosemirror-inputrules";
import { Node as ProsemirrorNode } from 'prosemirror-model';
import toggleWrap from "../commands/toggleWrap";
import Node from "./Node";
import ReactDOM from "react-dom";
import base from '../dictionary';
import { MenuItem } from '../types';
import RichMarkdownEditor from '..';

export type ChildBuilder = {
  label: string;
  className: string;
  builder: (props: { node: ProsemirrorNode, editor: RichMarkdownEditor }, options: Partial<typeof base> & {
    readOnly: boolean;
  }) => JSX.Element;
  menuItem: Omit<MenuItem, "title" | "attrs">;
};

export default class Measure extends Node {
  private static readonly delegates: Record<string, ChildBuilder> = {};
  static registerDelegate(
    className: string,
    node: Omit<ChildBuilder, "className">
  ) {
    Measure.delegates[className] = {
      className: className,
      ...node,
    };
  }

  static get blockMenuItems(): MenuItem[] {
    return Object.entries(Measure.delegates).map(([key, { label, menuItem }]) => ({
      ...menuItem,
      name: "container_measure",
      title: label,
      attrs: {
        child: key,
      }
    }));
  }

  get name() {
    return "container_measure";
  }

  get schema() {
    return {
      attrs: {
        child: {
          default: Object.entries(Measure.delegates)[0][0],
        },
        state: {
          default: {}
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
              (v, k) => (v != null ? v : dom.className.includes(k) ? k : v),
              undefined
            ),
          }),
        },
      ],
      toDOM: (node) => {
        const select = document.createElement("select");
        select.addEventListener("change", this.handleChildChange);

        Object.entries(Measure.delegates).forEach(([key, { label }]) => {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = label;
          option.selected = node.attrs.child === key;
          select.appendChild(option);
        });


        let component;
        Object.entries(Measure.delegates).forEach(([key, { builder }]) => {
          if (node.attrs.child == key) {
            component = builder({
              node: node,
              editor: this.editor,
            }, this.options as any);
          }
        });

        const container = document.createElement("div");
        ReactDOM.render(component, container);

        // construct a useState hook for react writing into the 
        // ```json field?
        // this.editor.view.state.tr.setNodeMarkup(node, undefined, {})

        return [
          "div",
          { class: `measure-block ${node.attrs.child}` },
          ["div", { contentEditable: false }, select],
          ["div", { class: "content" }, 0],
          ["div", { class: "controls", contentEditable: false }, container],
        ];
      },
    };
  }

  commands({ type }) {
    return (attrs) => toggleWrap(type, attrs);
  }

  handleChildChange = (event) => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        child: element.value,
      });
      view.dispatch(transaction);
    }
  };

  inputRules({ type }) {
    return [wrappingInputRule(/^:::\{(measure)\}$/, type)];
  }

  toMarkdown(state, node) {
    state.write("\n:::{measure}{" + (node.attrs.child || Object.entries(Measure.delegates)[0][0]) + "}\n");
    // state.write("```json\n" + `${JSON.stringify(node.attrs.state, null, 2)}\n` + "```\n")
    state.renderContent(node);
    state.ensureNewLine();
    state.write(":::");
    state.closeBlock(node);
  }

  parseMarkdown() {
    return {
      block: "container_measure",
      getAttrs: (tok) => ({ style: tok.info.match(/^\{measure}{(.*)\}/)[1] }),
    };
  }
}
