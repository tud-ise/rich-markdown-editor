import customFence from "markdown-it-container";

export default function measure(md): void {
  return customFence(md, "measure", {
    marker: ":",
    validate: (params: string) => params.trim().match(/^\{measure}{(.*)\}$/),
    render: function(tokens, idx) {
      const { info } = tokens[idx];

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="measure-block ${md.utils.escapeHtml(info)}">\n`;
      } else {
        // closing tag
        return "</div>\n";
      }
    },
  });
}
