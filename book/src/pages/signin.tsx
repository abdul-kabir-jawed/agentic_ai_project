import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Mail, Lock, LogIn } from 'lucide-react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './auth.module.css';

export default function SignInPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signupUrl = useBaseUrl('/signup');
  const homepageUrl = useBaseUrl('/');
  const { signIn, session } = useAuth();

  // Redirect if already signed in
  useEffect(() => {
    if (session) {
      window.location.href = homepageUrl;
    }
  }, [session, homepageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Failed to sign in. Please check your credentials.');
      setIsLoading(false);
    } else {
      // Redirect to homepage on success
      window.location.href = homepageUrl;
    }
  };

  return (
    <Layout title="Sign In" description="Sign in to your account">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Welcome Back</h1>
            <p className={styles.authSubtitle}>Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorText}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner} />
              ) : (
                <>
                  <LogIn className={styles.buttonIcon} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p className={styles.footerText}>
              Don't have an account?{' '}
              <a href={signupUrl} className={styles.footerLink}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

