import * as React from "react";
import Measure from "../Measure";
import { TodoListIcon } from "outline-icons";

const gridBasedMeasuresScaffold = [
  { label: "Rubric", className: "rubric", validator: () => true },
];

type GridBasedState = {
  enabled: boolean;
};

const registerGridBasedMeasureDelegate = ({
  className,
  label,
}: Omit<typeof gridBasedMeasuresScaffold[number], "validator">) => {
  Measure.registerDelegate(className, {
    label: `${label} Rating`,
    // eslint-disable-next-line react/display-name
    builder: (state: GridBasedState, { set, attrs }) => {
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

gridBasedMeasuresScaffold.forEach(({ /*validator,*/ ...props }) =>
  registerGridBasedMeasureDelegate(props /*, validator*/)
);
