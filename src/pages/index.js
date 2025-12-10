// src/pages/index.js

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';

// Define the features data to make the component cleaner
const features = [
  {
    title: 'Comprehensive Curriculum',
    icon: '📚',
    description: 'Go from foundational ROS 2 concepts to advanced control systems for autonomous humanoids.',
  },
  {
    title: 'Hands-On Projects',
    icon: '⚙️',
    description: 'Apply your knowledge with practical exercises and real-world robot simulation projects.',
  },
  {
    title: 'AI-Powered Assistant',
    icon: '🤖',
    description: 'Stuck on a concept? Our AI assistant is available 24/7 to answer your questions instantly.',
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="vv-feature-card">
        <div className="vv-feature-card__icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="vv-hero__section">
      <div className="vv-container">
        <div className="vv-hero__content">
          <h1 className="vv-hero__title">
            Master <span className="vv-gradient-text">Physical AI</span> & Humanoid Robotics
          </h1>
          <p className="vv-hero__subtitle">
            Build intelligent robots that understand and interact with the physical world. From ROS 2 to autonomous humanoids.
          </p>
          <div className="vv-hero__buttons">
            <Link
              className="vv-button vv-button--primary"
              to="/docs/intro">
              Start Learning
            </Link>
            <Link
              className="vv-button vv-button--secondary"
              to="/docs/category/1-introduction-to-physical-ai">
              Browse Chapters
            </Link>
          </div>
        </div>
        <div className="vv-hero__visual">
          <div className="vv-hero__visual-emoji">🤖</div>
        </div>
      </div>
    </header>
  );
}

function StatsBar() {
  return (
    <div className="vv-stats-bar">
      35+ Chapters • 400+ Concepts • AI-Powered Assistant • 100% Free
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Master Physical AI & Humanoid Robotics`}
      description="Build intelligent robots that understand and interact with the physical world. From ROS 2 to autonomous humanoids.">
      {/* This wrapper div scopes all our custom styles */}
      <div className="vibrant-verdant-homepage">
        {/* All styles are embedded here to avoid external CSS files */}
        <style>{`
          /* --- 1. Font Imports --- */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

          /* --- 2. Scoped Theme Variables & Reset --- */
          .vibrant-verdant-homepage {
            /* Light Mode Colors */
            --vv-ifm-color-primary: #10b981;
            --vv-ifm-color-secondary: #f97316;
            --vv-ifm-color-emphasis-300: #fbbf24;
            --vv-ifm-background-color: #ffffff;
            --vv-ifm-background-surface-color: #f9fafb;
            --vv-ifm-color-content: #1e293b;
            --vv-ifm-color-content-secondary: #64748b;
            --vv-ifm-border-color: #e2e8f0;
            --vv-hero-bg-gradient: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(16, 185, 129, 0.05) 100%);
            --vv-primary-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
            --vv-secondary-gradient: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          }

          [data-theme='dark'] .vibrant-verdant-homepage {
            /* Dark Mode Colors */
            --vv-ifm-color-primary: #34d399;
            --vv-ifm-color-secondary: #fb923c;
            --vv-ifm-color-emphasis-300: #fcd34d;
            --vv-ifm-background-color: #0f172a;
            --vv-ifm-background-surface-color: #1e293b;
            --vv-ifm-color-content: #f1f5f9;
            --vv-ifm-color-content-secondary: #94a3b8;
            --vv-ifm-border-color: #334155;
            --vv-hero-bg-gradient: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(52, 211, 153, 0.1) 100%);
            --vv-primary-gradient: linear-gradient(135deg, #34d399 0%, #10b981 100%);
            --vv-secondary-gradient: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          }
          
          /* --- 3. Scoped Component Styles --- */
          .vibrant-verdant-homepage {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.8;
            margin-top: 40px; /* Space below the navbar */
            margin-bottom: 80px; /* Space above the footer */
          }

          .vibrant-verdant-homepage code, .vibrant-verdant-homepage pre {
            font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
          }

          .vv-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          /* Hero Section */
          .vv-hero__section {
            background: var(--vv-hero-bg-gradient);
            padding: 6rem 0;
            min-height: 700px;
            display: flex;
            align-items: center;
          }
          .vv-hero__section .vv-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
          }
          .vv-hero__content { text-align: left; }
          .vv-hero__title {
            font-size: 3.5rem;
            font-weight: 800;
            color: var(--vv-ifm-color-content);
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }
          .vv-gradient-text {
            background: var(--vv-primary-gradient);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          }
          .vv-hero__subtitle {
            font-size: 1.25rem;
            color: var(--vv-ifm-color-content-secondary);
            margin-bottom: 3rem;
            max-width: 500px;
          }
          .vv-hero__buttons {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
          }
          .vv-button {
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            text-decoration: none !important;
            display: inline-block;
          }
          .vv-button:hover {
            transform: scale(1.05);
            text-decoration: none !important;
          }
          .vv-button--primary {
            background: var(--vv-primary-gradient) !important;
            border: none;
            color: white !important;
          }
          .vv-button--secondary {
            background: transparent;
            color: var(--vv-ifm-color-primary);
            border: 2px solid var(--vv-ifm-color-primary);
          }
          .vv-button--secondary:hover {
            background: var(--vv-ifm-color-primary);
            color: white;
          }
          .vv-hero__visual {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .vv-hero__visual-emoji {
            font-size: 200px;
            animation: vv-float 6s ease-in-out infinite;
          }

          /* Stats Bar */
          .vv-stats-bar {
            background: var(--vv-primary-gradient);
            color: white;
            text-align: center;
            font-weight: 600;
            padding: 2rem;
            font-size: 1.1rem;
          }

          /* Features Section */
          .vibrant-verdant-homepage main {
            padding: 120px 0; /* Top and bottom padding */
            background: var(--vv-ifm-background-surface-color);
            margin-top: 80px;
          }
          .vibrant-verdant-homepage main .row {
            --ifm-spacing-horizontal: 2rem;
          }
          .vv-feature-card {
            background-color: var(--vv-ifm-background-color);
            border: 1px solid var(--vv-ifm-border-color);
            border-radius: 20px;
            padding: 56px;
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .vv-feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .vv-feature-card__icon {
            font-size: 64px;
            width: 120px;
            height: 120px;
            background-color: rgba(16, 185, 129, 0.1);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 2rem;
          }
          .vv-feature-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: var(--vv-ifm-color-content);
          }
          .vv-feature-card p {
            font-size: 1rem;
            color: var(--vv-ifm-color-content-secondary);
            line-height: 1.7;
            margin: 0;
          }

          /* --- 4. Animations --- */
          @keyframes vv-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          /* --- 5. Responsive Adjustments --- */
          @media screen and (max-width: 996px) {
            .vibrant-verdant-homepage {
              margin-top: 20px;
              margin-bottom: 40px; /* Adjusted for mobile */
            }
            .vv-hero__section {
              padding: 4rem 0;
              min-height: auto;
            }
            .vv-hero__section .vv-container {
              grid-template-columns: 1fr;
              text-align: center;
              gap: 2rem;
            }
            .vv-hero__content {
              text-align: center;
            }
            .vv-hero__buttons {
              justify-content: center;
            }
            .vv-hero__visual-emoji {
              font-size: 150px;
            }
            .vv-hero__title {
              font-size: 2.8rem;
            }
            .vibrant-verdant-homepage main {
              margin-top: 60px;
              padding: 60px 0;
            }
            .vv-feature-card {
              padding: 40px;
            }
          }
        `}</style>

        <StatsBar />
        <HomepageHeader />
        <main>
          <div className="vv-container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}