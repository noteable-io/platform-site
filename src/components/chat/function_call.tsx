import React, { useCallback, useEffect, useState } from "react";
import styles from "./function_call.module.css";

interface ChatFunctionProps {
  name?: string;
  verbage?: string;
  children?: React.ReactNode;
  request?: string;
  open?: boolean;
  finished?: boolean;
  onToggle?: () => void;
}

export const CollapseIcon = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.collapseIcon}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ExpandIcon = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.expandIcon}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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

export const ChatFunctionCall: React.FC<ChatFunctionProps> = ({
  name = "Noteable",
  verbage = "Used",
  children = null,
  request = null,
  finished = true,
  open = null,
}) => {
  let requestContent = null;

  return (
    <details className={styles.details} open={open}>
      <summary className={styles.summary}>
        <span className={styles.summaryContent}>
          <span className={styles.functionVerbage}>{verbage}</span>
          <b>{name}</b>
          <span className={styles.inlinePre}>{finished ? "" : "..."}</span>
        </span>

        <span className={styles.icon}>
          <CollapseIcon />
          <ExpandIcon />
        </span>
      </summary>
      <div className={styles.callInfo}>{children}</div>
    </details>
  );
};

export default ChatFunctionCall;
