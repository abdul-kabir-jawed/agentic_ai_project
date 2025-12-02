import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import { Mail, User, Code, Award, LogOut } from 'lucide-react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './auth.module.css';

export default function ProfilePage(): React.JSX.Element {
  const { user, session, signOut, loading } = useAuth();
  const homeUrl = useBaseUrl('/');
  const signinUrl = useBaseUrl('/signin');

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      window.location.href = signinUrl;
    }
  }, [session, loading, signinUrl]);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const { error } = await signOut();
      if (!error) {
        window.location.href = homeUrl;
      } else {
        console.error('Logout failed:', error.message);
        // Optionally, show a user-facing error message
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Layout title="Profile" description="Your profile information">
        <div className={styles.authContainer}>
          <div className={styles.profileCard}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span className={styles.loadingSpinner} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render if no user
  if (!user || !session) {
    return null;
  }

  const userData = {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    isTechnical: user.user_metadata?.is_technical || false,
    experienceLevel: user.user_metadata?.experience_level || '',
  };

  const getExperienceBadge = (level: string) => {
    const badges = {
      beginner: { label: 'Beginner', color: '#10b981', icon: '🌱' },
      intermediate: { label: 'Intermediate', color: '#3b82f6', icon: '🚀' },
      advanced: { label: 'Advanced', color: '#8b5cf6', icon: '⭐' },
    };
    return badges[level as keyof typeof badges] || badges.beginner;
  };

  const badge = getExperienceBadge(userData.experienceLevel);

  return (
    <Layout title="Profile" description="Your profile information">
      <div className={styles.authContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              <User className={styles.avatarIcon} />
            </div>
            <h1 className={styles.profileTitle}>{userData.name}</h1>
          </div>

          <div className={styles.profileContent}>
            <div className={styles.profileSection}>
              <div className={styles.profileItem}>
                <div className={styles.profileItemHeader}>
                  <Mail className={styles.profileItemIcon} />
                  <span className={styles.profileItemLabel}>Email</span>
                </div>
                <p className={styles.profileItemValue}>{userData.email}</p>
              </div>

              <div className={styles.profileItem}>
                <div className={styles.profileItemHeader}>
                  <Code className={styles.profileItemIcon} />
                  <span className={styles.profileItemLabel}>Technical Background</span>
                </div>
                <div className={styles.badgeContainer}>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: userData.isTechnical
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                      color: userData.isTechnical ? '#10b981' : '#ef4444',
                      borderColor: userData.isTechnical
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    {userData.isTechnical ? 'Technical' : 'Non-Technical'}
                  </span>
                </div>
              </div>

              {userData.isTechnical && (
                <div className={styles.profileItem}>
                  <div className={styles.profileItemHeader}>
                    <Award className={styles.profileItemIcon} />
                    <span className={styles.profileItemLabel}>Experience Level</span>
                  </div>
                  <div className={styles.badgeContainer}>
                    <span
                      className={styles.experienceBadge}
                      style={{
                        backgroundColor: `${badge.color}15`,
                        color: badge.color,
                        borderColor: `${badge.color}30`,
                      }}
                    >
                      <span className={styles.badgeIcon}>{badge.icon}</span>
                      {badge.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.profileActions}>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut className={styles.logoutIcon} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

