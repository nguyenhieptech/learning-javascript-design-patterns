import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Understand how libraries work behind the scenes',
    Svg: require('../../static/img/undraw_responsive_6c8s.svg').default,
    description: (
      <>
        Understand what design patterns are being used in a lot of libraries and
        frameworks.
      </>
    ),
  },
  {
    title: 'Focus on Javascript',
    Svg: require('../../static/img/undraw_static_website_0107.svg').default,
    description: <>Help you to become a better Javascript developer.</>,
  },
  {
    title: 'Essential book for any web developers',
    Svg: require('../../static/img/undraw_web_devices_ad58.svg').default,
    description: (
      <>Get to know how those smart developers out there develop Javascript libraries.</>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className='text--center padding-horiz--md'>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
