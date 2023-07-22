import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  img: string;
  description: JSX.Element;
  url: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "genai",
    img: "/img/genai-logo.png",
    description: (
      <>
        IPython extension to help you code better with the power of OpenAI's
        Large Language Models.
      </>
    ),
    url: "https://app.noteable.io/f/1605d16d-f5d3-4099-8fec-2ca727075b3b/Introducing-Genai.ipynb",
  },
  {
    title: "origami",
    img: "/img/origami-logo.png",
    description: (
      <>Origami is the official Python SDK for talking to Noteable Notebooks.</>
    ),
    url: "https://noteable-origami.readthedocs.io/en/latest/",
  },
  {
    title: "dx",
    img: "/img/dx-logo.png",
    description: (
      <>
        dx provides convenient formatting and IPython display formatter
        registration for tabular data and DEX media types.
      </>
    ),
    url: "https://noteable-io.github.io/dx/",
  },
];

function Feature({ title, img, description, url }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img width="150px" src={img} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="text--center">
        <a href={url} target="_blank" rel="noreferrer">
          Learn more about {title}
        </a>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
