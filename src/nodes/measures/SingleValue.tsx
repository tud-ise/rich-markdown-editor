import * as React from "react";
import { Node } from "prosemirror-model";
import Measure from "../Measure";

Measure.registerDelegate("single", {
  label: "Single Value",
  builder: (node: Node) => {
    return <div style={{}}></div>;
  },
});
