import React, { ReactNode } from "react";
import styles from "./SlackMessage.module.css";

interface SlackMessageProps {
  avatarUrl: string;
  name: string;
  timestamp: string;
  children: ReactNode;
}

const SlackMessage: React.FC<SlackMessageProps> = ({
  avatarUrl,
  name,
  timestamp,
  children,
}) => (
  <div className={styles.messageContainer}>
    <div className={styles.avatar}>
      <img src={avatarUrl} alt={`${name}'s avatar`} />
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
