import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, deleteAccount, restoreAccount, isAdmin } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? You can restore it within 48 hours.'
      )
    ) {
      setDeleteLoading(true);
      try {
        await deleteAccount();
        alert(
          'Your account has been deleted. You can restore it within 48 hours.'
        );
      } catch (error) {
        alert('Failed to delete account. Please try again.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleRestoreAccount = async () => {
    setRestoreLoading(true);
    try {
      await restoreAccount();
      alert('Your account has been restored successfully!');
    } catch (error) {
      alert('Failed to restore account. Please try again.');
    } finally {
      setRestoreLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="logo">
            Diary App
          </Link>

          {user && (
            <div className="nav-links">
              <Link to="/diary">My Diary</Link>
              {isAdmin && (
                <>
                  <Link to="/invites">Invites</Link>
                </>
              )}
            </div>
          )}

          <div className="user-section">
            {user ? (
              <>
                <span className="username">{user.username}</span>
                {user.isDeleted ? (
                  <button
                    onClick={handleRestoreAccount}
                    className="btn-restore"
                    disabled={restoreLoading}
                  >
                    {restoreLoading ? 'Restoring...' : 'Restore Account'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn-delete"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                    <button onClick={logout} className="btn-logout">
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn-link">
                  Login
                </Link>
                <Link to="/register" className="btn-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {user?.isDeleted && (
        <div className="deleted-account-banner">
          ⚠️ Your account has been deleted. You can restore it within 48 hours
          by clicking the "Restore Account" button.
        </div>
      )}

      <main className="main-content">{children}</main>

      <footer className="footer">
        <p>&copy; 2026 Diary App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
