import React, { ReactNode } from "react";
import styles from "./SlackMessage.module.css";

import ThemedImage from "@theme/ThemedImage";

interface SlackMessageProps {
  avatarUrl: string;
  avatarUrlDark?: string;
  name: string;
  timestamp: string;
  children: ReactNode;
}

export const ReplyBar = ({ text }) => {
  return (
    <div className={styles.threadSeparatorRowGeneric}>
      <div className={styles.threadsFlexpaneSeparator}>
        <span className={styles.threadsFlexpaneSeparatorCount}>{text}</span>
        <hr className={styles.threadsFlexpaneSeparatorLine} />
      </div>
    </div>
  );
};

export const SlackThread = ({ children }) => {
  return <div className={styles.threadContainer}>{children}</div>;
};

const SlackMessage: React.FC<SlackMessageProps> = ({
  avatarUrl,
  avatarUrlDark,
  name,
  timestamp,
  children,
}) => (
  <div className={styles.messageContainer}>
    <div className={styles.avatar}>
      <ThemedImage
        alt={`${name}'s avatar`}
        sources={{
          light: avatarUrl,
          dark: avatarUrlDark || avatarUrl,
        }}
      />
    </div>
    <div className={styles.messageContent}>
      <span className={styles.sender}>
        <button className={styles.senderButton}>{name}</button>
        <span className={styles.marginLeft}>
          <span className={styles.appBadge}>APP</span>
        </span>
      </span>
      <span className={styles.timestamp}>{timestamp}</span>
      <div className={styles.messageText}>{children}</div>
    </div>
  </div>
);

export default SlackMessage;
