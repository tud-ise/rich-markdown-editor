import * as React from "react";
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
  Measure.registerDelegate(className, {
    label: `${label} Rating`,
    builder: (state, { set, attrs }, { readOnly }) => {
      return (
        <div>
          <code>{JSON.stringify(attrs)}</code>
          <button onClick={() => set({ enabled: !state.enabled })}>
            Toggle
          </button>
        </div>
      );
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
