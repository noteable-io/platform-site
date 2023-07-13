import clsx from "clsx";
import React from "react";

import { InputBlock, OutputBlock } from "@site/src/components/cell";
import CodeBlock from "@theme-original/CodeBlock";

import type { Props as BaseProps } from "@theme/CodeBlock";

import styles from "./styles.module.css";

type Props = BaseProps & {
  cell?: boolean;
  output?: boolean;
  count?: number;
  chatcall?: boolean;
  request?: boolean;
  response?: boolean;
  plugin?: string;
};

export const ReqRep = ({ children, heading }) => {
  return (
    <div className={styles.call}>
      <div className={styles.callHeading}>
        <span style={{ textTransform: "uppercase" }}>{heading}</span>
      </div>
      <div className={styles.callBody}>{children}</div>
    </div>
  );
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
  if (!props.cell && !props.output && !props.chatcall) {
    return <CodeBlock {...props} />;
  }

  if (props.chatcall) {
    // HACK: Allow the CodeBlockContainer to know this is an output block
    const className = clsx(props.className, "chatcall");

    let heading = "";
    if (props.request) {
      heading = `Request to ${props.plugin}`;
    } else if (props.response) {
      heading = `Response from ${props.plugin}`;
    }

    return (
      <ReqRep {...props} heading={heading}>
        <CodeBlock {...props} className={className} />
      </ReqRep>
    );
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
