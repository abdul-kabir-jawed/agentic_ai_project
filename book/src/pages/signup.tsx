import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './auth.module.css';
import { JSX } from 'react/jsx-runtime';

export default function SignUpPage(): JSX.Element {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isTechnical: false,
    experienceLevel: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signinUrl = useBaseUrl('/signin');
  const homepageUrl = useBaseUrl('/');
  const { signUp, session } = useAuth();

  // Redirect if already signed in
  useEffect(() => {
    if (session) {
      window.location.href = homepageUrl;
    }
  }, [session, homepageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (formData.isTechnical && !formData.experienceLevel) {
      setError('Please select your experience level');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.isTechnical,
      formData.isTechnical ? formData.experienceLevel : undefined
    );

    if (error) {
      setError(error.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
    } else {
      // Redirect to homepage on success
      window.location.href = homepageUrl;
    }
  };

  return (
    <Layout title="Sign Up" description="Create your account">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Create Account</h1>
            <p className={styles.authSubtitle}>Start your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isTechnical"
                  checked={formData.isTechnical}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>I have a technical background</span>
              </label>
            </div>

            {formData.isTechnical && (
              <div className={styles.inputGroup}>
                <label htmlFor="experienceLevel" className={styles.label}>
                  Experience Level
                </label>
                <div className={styles.inputWrapper}>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select your level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorText}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || (formData.isTechnical && !formData.experienceLevel)}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner} />
              ) : (
                <>
                  <UserPlus className={styles.buttonIcon} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <a href={signinUrl} className={styles.footerLink}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

