import React from "react";

import styles from "./styles.module.css";

type Props = {
  videoId: string;
  title: string;
};

const defaultProps = {
  videoId: "dQw4w9WgXcQ",
  title: "YouTube Video",
};

const YouTubeEmbed = ({ videoId, title }: Props = defaultProps) => (
  <div className={styles.embed}>
    <iframe
      title={title}
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  </div>
);

export default YouTubeEmbed;
