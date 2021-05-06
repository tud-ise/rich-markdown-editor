import * as React from "react";
import { Node } from "prosemirror-model";
import Measure from "../Measure";
import { BeakerIcon } from "outline-icons";

// define all single value measures with their respective validator
const singleValueMeasuresScaffold = [
  { label: "Text", className: "text", validator: () => true },
  { label: "Decimal", className: "decimal", validator: () => true },
  { label: "Float", className: "float", validator: () => true },
  { label: "Date", className: "date", validator: () => true },
] as const;

const registerSingleValueMeasureDelegate = (
  {
    className,
    label,
  }: Omit<typeof singleValueMeasuresScaffold[number], "validator">,
  validator: (value: any) => boolean
) => {
  Measure.registerDelegate(`single-${className}`, {
    label: `Single ${label} Value`,
    builder: (node: Node, { readOnly }) => {
      return <div style={{}}></div>;
    },
    menuItem: {
      icon: BeakerIcon,
      keywords: `measure single ${className}`,
    },
  });
};

singleValueMeasuresScaffold.forEach(({ validator, ...props }) =>
  registerSingleValueMeasureDelegate(props, validator)
);
