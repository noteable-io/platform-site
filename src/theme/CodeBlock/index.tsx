import clsx from "clsx";
import React from "react";

import { InputBlock, OutputBlock } from "@site/src/components/cell";
import CodeBlock from "@theme-original/CodeBlock";

import type { Props as BaseProps } from "@theme/CodeBlock";

type Props = BaseProps & {
  cell?: boolean;
  output?: boolean;
  count?: number;
};

export default function CodeBlockWrapper(props: Props) {
  /**
   * This CodeBlockWrapper introduces two new types of markdown code blocks,
   * to mimic Jupyter Notebook frontend cells:
   *
   *   - Input Blocks
   *   - Output Blocks
   *
   * To use them, simply add the following to your markdown:
   *
   * ```python cell
   * d = {"foo": "bar"}
   * d
   * ```
   *
   * ```json output
   * {
   *   "foo": "bar"
   * }
   * ```
   *
   * The execution count can be added to either using the `count` prop:
   * ```python cell count=1
   * d = {"foo": "bar"}
   * d
   * ```
   *
   * ```json output count=1
   * {
   *   "foo": "bar"
   * }
   * ```
   *
   */

  // Regular Code Blocks
  if (!props.cell && !props.output) {
    return <CodeBlock {...props} />;
  }

  let count =
    // Accept count as the primary and allow for aliases
    props.count ||
    // @ts-ignore
    props.executionCount ||
    // @ts-ignore
    props.execution_count;

  // Handle basic plaintext outputs in a friendly way for JSON outputs
  if (props.output) {
    // HACK: Allow the CodeBlockContainer to know this is an output block
    const className = clsx(props.className, "chatlab-cell-output");

    return (
      <OutputBlock count={count}>
        <CodeBlock {...props} className={className} />
      </OutputBlock>
    );
  }

  return (
    <InputBlock count={count}>
      <CodeBlock {...props} />
    </InputBlock>
  );
}
