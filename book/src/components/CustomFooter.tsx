import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const CustomFooter: React.FC = () => {
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  console.log('Docusaurus Base URL:', baseUrl);
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Section */}
          <div className="footer__brand-section">
            <div className="footer__brand">
              <img
                src={`${baseUrl}img/physical-ai-favicon.svg`}
                alt="Physical AI Logo"
                className="footer__brand-logo"
              />
              <span>PhysicalAI.io</span>
            </div>
            <p className="footer__description">
              An open-source initiative documenting embodied intelligence—from force-control firmware to policy distillation. Built by robotics enthusiasts for the global community.
            </p>
          </div>

          {/* Chapters Section */}
          <div className="footer__section">
            <h3 className="footer__title">Chapters</h3>
            <div className="footer__chapters-grid">
                            <Link className="footer__link-item" to="/docs/chapter-1-introduction-to-physical-ai" onClick={() => console.log('Navigating to:', "/docs/chapter-1-introduction-to-physical-ai")}>Chapter 1: Physical AI</Link>
                            <Link className="footer__link-item" to="/docs/chapter-2-humanoid-robotics-overview" onClick={() => console.log('Navigating to:', "/docs/chapter-2-humanoid-robotics-overview")}>Chapter 2: Overview</Link>
                            <Link className="footer__link-item" to="/docs/chapter-3-humanoid-robotics-sensors-and-actuators" onClick={() => console.log('Navigating to:', "/docs/chapter-3-humanoid-robotics-sensors-and-actuators")}>Chapter 3: Sensors & Actuators</Link>
                            <Link className="footer__link-item" to="/docs/chapter-4-navigation-and-path-planning" onClick={() => console.log('Navigating to:', "/docs/chapter-4-navigation-and-path-planning")}>Chapter 4: Navigation</Link>
                            <Link className="footer__link-item" to="/docs/chapter-5-motion-planning-and-control" onClick={() => console.log('Navigating to:', "/docs/chapter-5-motion-planning-and-control")}>Chapter 5: Motion Control</Link>
              <Link className="footer__link-item" to="/docs/chapter-6-machine-learning-for-robotics">Chapter 6: Machine Learning</Link>
              <Link className="footer__link-item" to="/docs/chapter-7-human-robot-interaction">Chapter 7: HRI</Link>
              <Link className="footer__link-item" to="/docs/chapter-8-advanced-topics-future-directions">Chapter 8: Advanced Topics</Link>
            </div>
          </div>

          {/* Community Section */}
          <div className="footer__section">
            <h3 className="footer__title">Community</h3>
            <ul className="footer__links-list">
              <li>
                <Link className="footer__link-item" to="/docs/chapter-1-introduction-to-physical-ai">
                  Start Reading
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2025 Physical AI Initiative. All rights reserved.
          </p>
          <p className="footer__credit">
            Powered by contributors across Physical AI & Humanoid Robotics
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
