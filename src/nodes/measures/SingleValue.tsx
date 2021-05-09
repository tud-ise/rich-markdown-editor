import * as React from "react";
import Measure from "../Measure";
import { BeakerIcon } from "outline-icons";

// define all single value measures with their respective validator
const singleValueMeasuresScaffold = [
  {
    label: "Text",
    className: "text",
    htmlType: "text",
    validator: () => true,
  },
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
  {
    label: "Date",
    className: "date",
    htmlType: "date",
    validator: () => true,
  },
  {
    label: "Percentage",
    className: "percentage",
    htmlType: "number",
    validator: () => true,
  },
] as const;

type SingleValueState = {
  enabled: boolean;
};

const registerSingleValueMeasureDelegate = ({
  className,
  label,
  htmlType,
}: Omit<typeof singleValueMeasuresScaffold[number], "validator">) => {
  Measure.registerDelegate(className, {
    label: `${label} Value`,
    // eslint-disable-next-line react/display-name
    builder: (state: SingleValueState, { set, attrs }) => {
      console.log(state.enabled);
      return (
        <div>
          <code>{JSON.stringify(attrs)}</code>
          <input type={htmlType} disabled={!state.enabled}></input>

          <button onClick={() => set({ enabled: !state.enabled })}>
            Toggle
          </button>
        </div>
      );
    },
    menuItem: {
      icon: BeakerIcon,
      keywords: `measure single ${className}`,
    },
  });
};

singleValueMeasuresScaffold.forEach(({ /*validator,*/ ...props }) =>
  registerSingleValueMeasureDelegate(props /*, validator*/)
);
