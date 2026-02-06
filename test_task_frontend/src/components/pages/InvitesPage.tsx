import React, { useState, useEffect } from 'react';
import { useInvites } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import './InvitesPage.css';

const InvitesPage: React.FC = () => {
  const {
    invites,
    loading,
    error,
    createInvite,
    fetchInvites,
    goToPage,
    currentPage,
  } = useInvites();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createInvite({ email });

    if (success) {
      setEmail('');
      setShowForm(false);
    }
  };

  const copyToClipboard = (code: string) => {
    const inviteLink = `${window.location.origin}/register?invite=${code}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  if (loading && !invites) {
    return <Loading />;
  }

  return (
    <div className="invites-page">
      <div className="page-header">
        <h1>Manage Invites</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Invite'}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchInvites()} />}

      {showForm && (
        <div className="invite-form-container">
          <h2>Create New Invite</h2>
          <form onSubmit={handleSubmit} className="invite-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="user@example.com"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Invite'}
            </button>
          </form>
        </div>
      )}

      {invites && (
        <>
          <div className="invites-table-container">
            <table className="invites-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Expires At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.items.map((invite) => (
                  <tr key={invite.id}>
                    <td>{invite.email}</td>
                    <td className="code-cell">
                      <code>{invite.code}</code>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${invite.isUsed ? 'used' : 'available'}`}
                      >
                        {invite.isUsed ? 'Used' : 'Available'}
                      </span>
                    </td>
                    <td>{new Date(invite.expiresAt).toLocaleDateString()}</td>
                    <td>
                      {!invite.isUsed && (
                        <button
                          className="btn-copy"
                          onClick={() => copyToClipboard(invite.code)}
                        >
                          Copy Link
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invites.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-page"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {invites.totalPages}
              </span>
              <button
                className="btn-page"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === invites.totalPages || loading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvitesPage;
