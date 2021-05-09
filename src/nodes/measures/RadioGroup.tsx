import * as React from "react";
import Measure from "../Measure";
import { BulletedListIcon } from "outline-icons";

const radioGroupMeasuresScaffold = [
  { label: "Star Rating", className: "star", validator: () => true },
  { label: "Likert Rating", className: "likert", validator: () => true },
  { label: "Dropdown Selection", className: "dropdown", validator: () => true },
];

type RadioGroupState = {
  enabled: boolean;
};

const registerRadioGroupValueMeasureDelegate = ({
  className,
  label,
}: Omit<typeof radioGroupMeasuresScaffold[number], "validator">) => {
  Measure.registerDelegate(className, {
    label: label,
    // eslint-disable-next-line react/display-name
    builder: (state: RadioGroupState, { set, attrs }) => {
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
      icon: BulletedListIcon,
      keywords: `measure radio group ${className}`,
    },
  });
};

radioGroupMeasuresScaffold.forEach(({ /*validator,*/ ...props }) =>
  registerRadioGroupValueMeasureDelegate(props /*, validator*/)
);
