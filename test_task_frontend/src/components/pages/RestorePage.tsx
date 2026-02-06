import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './RestorePage.css';

const RestorePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="restore-page">
      <div className="restore-container">
        <h1>Account Restoration</h1>

        {user ? (
          <div className="restore-success">
            <div className="success-icon">✓</div>
            <h2>Account Restored Successfully!</h2>
            <p>Welcome back, {user.username}!</p>
            <div className="user-info">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
            </div>
          </div>
        ) : (
          <div className="restore-info">
            <p>Please log in to restore your account.</p>
            <a href="/login" className="btn-primary">
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestorePage;
