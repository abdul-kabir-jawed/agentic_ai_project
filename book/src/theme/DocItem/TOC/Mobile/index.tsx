import React, {type ReactNode, useState} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOCItems from '@theme/TOCItems';
import {ChevronDown, ChevronUp} from 'lucide-react';

import styles from './styles.module.css';

function filterTOCItems(
  toc: Array<{value: string; id: string; level: number}>,
  minHeadingLevel: number,
  maxHeadingLevel: number,
): Array<{value: string; id: string; level: number}> {
  return toc.filter(
    (item) => item.level >= minHeadingLevel && item.level <= maxHeadingLevel,
  );
}

export default function DocItemTOCMobile(): ReactNode {
  const {toc, frontMatter} = useDoc();
  const [isOpen, setIsOpen] = useState(false);

  const minHeadingLevel = frontMatter.toc_min_heading_level ?? 2;
  const maxHeadingLevel = frontMatter.toc_max_heading_level ?? 3;

  const filteredTOC = filterTOCItems(toc, minHeadingLevel, maxHeadingLevel);

  if (!toc || toc.length === 0 || filteredTOC.length === 0) {
    return null;
  }

  return (
    <div className={clsx(ThemeClassNames.docs.docTocMobile, styles.tocMobile)}>
      <button
        className={styles.tocToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle table of contents"
      >
        <span className={styles.tocToggleText}>Table of Contents</span>
        {isOpen ? (
          <ChevronUp className={styles.tocToggleIcon} />
        ) : (
          <ChevronDown className={styles.tocToggleIcon} />
        )}
      </button>
      {isOpen && (
        <div className={styles.tocDropdown}>
          <nav className={clsx('table-of-contents', styles.tocItems)}>
            <TOCItems
              toc={filteredTOC}
              minHeadingLevel={minHeadingLevel}
              maxHeadingLevel={maxHeadingLevel}
            />
          </nav>
        </div>
      )}
    </div>
  );
}
