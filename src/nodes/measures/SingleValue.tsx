import * as React from "react";
import { Node } from "prosemirror-model";
import Measure from "../Measure";
import { BeakerIcon } from "outline-icons";

// define all single value measures with their respective validator
const singleValueMeasuresScaffold = [
  { label: "Text", className: "text", htmlType: "text", validator: () => true },
  {
    label: "Decimal",
    className: "decimal",
    htmlType: "number",
    validator: () => true,
  },
  {
    label: "Float",
    className: "float",
    htmlType: "number",
    validator: () => true,
  },
  { label: "Date", className: "date", htmlType: "date", validator: () => true },
  {
    label: "Percentage",
    className: "percentage",
    htmlType: "number",
    validator: () => true,
  },
] as const;

const registerSingleValueMeasureDelegate = (
  {
    className,
    label,
    htmlType,
  }: Omit<typeof singleValueMeasuresScaffold[number], "validator">,
  validator: (value: any) => boolean
) => {
  Measure.registerDelegate(className, {
    label: `${label} Value`,
    builder: ({}, { readOnly }) => {
      return <input type={htmlType} disabled={!readOnly}></input>;
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
