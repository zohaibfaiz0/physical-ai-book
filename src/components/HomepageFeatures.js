import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Embodied Intelligence',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Learn about the principles of embodied AI and how physical embodiment
        enables true intelligence in humanoid robots through real-world interaction.
      </>
    ),
  },
  {
    title: 'Advanced Robotics',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Master ROS 2, simulation environments, and NVIDIA Isaac for cutting-edge
        humanoid development and control systems.
      </>
    ),
  },
  {
    title: 'Conversational AI',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Build intelligent conversational robots with Vision-Language-Action models
        that understand and interact with the physical world.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container padding-vert--lg">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}