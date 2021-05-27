import customFence from "markdown-it-container";

export default function notice(md): void {
  return customFence(md, "notice", {
    marker: ":",
    validate: (params: string) => params.trim().match(/^\{notice}{(.*)\}$/),
    render: function(tokens, idx) {
      const { info } = tokens[idx];

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="notice-block notice-${md.utils.escapeHtml(
          info
        )}">\n`;
      } else {
        // closing tag
        return "</div>\n";
      }
    },
  });
}
