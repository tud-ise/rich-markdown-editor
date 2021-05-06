import * as React from "react";
import { Node } from "prosemirror-model";
import Measure from "../Measure";
import { TodoListIcon } from "outline-icons";

const gridBasedMeasuresScaffold = [
  { label: "Rubric", className: "rubric", validator: () => true },
];

const registerGridBasedMeasureDelegate = (
  {
    className,
    label,
  }: Omit<typeof gridBasedMeasuresScaffold[number], "validator">,
  validator: (value: any) => boolean
) => {
  Measure.registerDelegate(`grid-${className}`, {
    label: `${label} Rating`,
    builder: ({}, { readOnly }) => {
      return <div style={{}}></div>;
    },
    menuItem: {
      icon: TodoListIcon,
      keywords: `measure grid group ${className}`,
    },
  });
};

gridBasedMeasuresScaffold.forEach(({ validator, ...props }) =>
  registerGridBasedMeasureDelegate(props, validator)
);
