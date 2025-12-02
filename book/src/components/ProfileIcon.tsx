import { User } from 'lucide-react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './ProfileIcon.module.css';
import { JSX } from 'react/jsx-runtime';

export default function ProfileIcon(): JSX.Element {
  const profileUrl = useBaseUrl('/profile');
  return (
    <a
      href={profileUrl}
      className={styles.profileIcon}
      aria-label="Profile"
      title="Profile"
    >
      <User className={styles.profileIconSvg} />
    </a>
  );
}

