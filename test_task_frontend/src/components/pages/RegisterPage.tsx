import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthActions, useCaptcha } from '../../hooks';
import { inviteService } from '../../services';
import './LoginPage.css';

interface ValidationErrors {
  inviteCode?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  captchaCode?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, loading, error } = useAuthActions();
  const { captcha, fetchCaptcha, refreshCaptcha } = useCaptcha();

  const [formData, setFormData] = useState({
    inviteCode: searchParams.get('invite') || '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    captchaCode: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  useEffect(() => {
    const checkInvite = async () => {
      if (formData.inviteCode) {
        try {
          const invite = await inviteService.getByCode(formData.inviteCode);
          setInviteEmail(invite.email);
          setFormData((prev) => ({ ...prev, email: invite.email }));
          setValidationErrors((prev) => ({ ...prev, inviteCode: undefined }));
        } catch (err) {
          setValidationErrors((prev) => ({
            ...prev,
            inviteCode: 'Invalid invite code',
          }));
        }
      }
    };

    checkInvite();
  }, [formData.inviteCode]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'inviteCode':
        if (!value.trim()) return 'Invite code is required';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        break;
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3)
          return 'Username must be at least 3 characters long';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 6)
          return 'Password must be at least 6 characters long';
        break;
      case 'confirmPassword':
        if (!value.trim()) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'captchaCode':
        if (!value.trim()) return 'Captcha code is required';
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    errors.inviteCode = validateField('inviteCode', formData.inviteCode);
    errors.email = validateField('email', formData.email);
    errors.username = validateField('username', formData.username);
    errors.password = validateField('password', formData.password);
    errors.confirmPassword = validateField(
      'confirmPassword',
      formData.confirmPassword
    );
    errors.captchaCode = validateField('captchaCode', formData.captchaCode);

    setValidationErrors(errors);

    return !Object.values(errors).some((error) => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      inviteCode: true,
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
      captchaCode: true,
    });

    if (!captcha) {
      setValidationErrors((prev) => ({
        ...prev,
        captchaCode: 'Please wait for captcha to load',
      }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    const success = await register({
      inviteCode: formData.inviteCode,
      email: formData.email,
      password: formData.password,
      username: formData.username,
      captchaId: captcha.captchaId,
      captchaCode: formData.captchaCode,
    });

    if (success) {
      navigate('/login');
    } else {
      // Refresh captcha on error
      refreshCaptcha();
      setFormData((prev) => ({ ...prev, captchaCode: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleRefreshCaptcha = () => {
    refreshCaptcha();
    setFormData((prev) => ({ ...prev, captchaCode: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="inviteCode">Invite Code</label>
            <input
              type="text"
              id="inviteCode"
              name="inviteCode"
              value={formData.inviteCode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              className={
                touched.inviteCode && validationErrors.inviteCode ? 'error' : ''
              }
            />
            {inviteEmail && (
              <small style={{ color: '#27ae60' }}>
                Valid invite for: {inviteEmail}
              </small>
            )}
            {touched.inviteCode && validationErrors.inviteCode && (
              <small style={{ color: '#e74c3c' }}>
                {validationErrors.inviteCode}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading || !!inviteEmail}
              className={touched.email && validationErrors.email ? 'error' : ''}
            />
            {touched.email && validationErrors.email && (
              <small style={{ color: '#e74c3c' }}>
                {validationErrors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              className={
                touched.username && validationErrors.username ? 'error' : ''
              }
            />
            {touched.username && validationErrors.username && (
              <small style={{ color: '#e74c3c' }}>
                {validationErrors.username}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              className={
                touched.password && validationErrors.password ? 'error' : ''
              }
            />
            {touched.password && validationErrors.password && (
              <small style={{ color: '#e74c3c' }}>
                {validationErrors.password}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              className={
                touched.confirmPassword && validationErrors.confirmPassword
                  ? 'error'
                  : ''
              }
            />
            {touched.confirmPassword && validationErrors.confirmPassword && (
              <small style={{ color: '#e74c3c' }}>
                {validationErrors.confirmPassword}
              </small>
            )}
          </div>

          {captcha && (
            <div className="form-group">
              <label>Captcha</label>
              <div className="captcha-container">
                <div className="captcha-image">
                  <img
                    src={`data:image/png;base64,${captcha.captchaImageBase64}`}
                    alt="Captcha"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="captcha-refresh"
                  disabled={loading}
                >
                  Refresh Captcha
                </button>
                <input
                  type="text"
                  name="captchaCode"
                  value={formData.captchaCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter captcha code"
                  required
                  disabled={loading}
                  className={
                    touched.captchaCode && validationErrors.captchaCode
                      ? 'error'
                      : ''
                  }
                />
              </div>
              {touched.captchaCode && validationErrors.captchaCode && (
                <small style={{ color: '#e74c3c' }}>
                  {validationErrors.captchaCode}
                </small>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
