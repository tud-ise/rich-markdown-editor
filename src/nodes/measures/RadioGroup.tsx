import * as React from "react";
import { Node } from "prosemirror-model";
import Measure from "../Measure";
import { BulletedListIcon } from "outline-icons";

const radioGroupMeasuresScaffold = [
  { label: "Star Rating", className: "star", validator: () => true },
  { label: "Likert Rating", className: "likert", validator: () => true },
  { label: "Dropdown Selection", className: "dropdown", validator: () => true },
];

const registerRadioGroupValueMeasureDelegate = (
  {
    className,
    label,
  }: Omit<typeof radioGroupMeasuresScaffold[number], "validator">,
  validator: (value: any) => boolean
) => {
  Measure.registerDelegate(`group-${className}`, {
    label: label,
    builder: ({}, { readOnly }) => {
      return <div style={{}}></div>;
    },
    menuItem: {
      icon: BulletedListIcon,
      keywords: `measure radio group ${className}`,
    },
  });
};

radioGroupMeasuresScaffold.forEach(({ validator, ...props }) =>
  registerRadioGroupValueMeasureDelegate(props, validator)
);
