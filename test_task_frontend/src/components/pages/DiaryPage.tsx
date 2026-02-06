import React, { useState } from 'react';
import { useDiary } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import DiaryEntryCard from './DiaryEntryCard';
import DiaryEntryForm from './DiaryEntryForm';
import './DiaryPage.css';

const DiaryPage: React.FC = () => {
  const {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch,
    pageNumber,
    totalPages,
    totalCount,
    searchTerm,
    handleSearch,
    startDate,
    endDate,
    handleDateRangeChange,
    goToPage,
  } = useDiary();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  const handleCreate = async (content: string, image?: File) => {
    const success = await createEntry({ content, image });
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (
    id: string,
    content: string,
    image?: File,
    deleteCurrentImage?: boolean
  ) => {
    const success = await updateEntry(id, {
      content,
      image,
      deleteCurrentImage,
    });
    if (success) {
      setEditingEntry(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    handleSearch('');
  };

  const handleDateRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDateRangeChange(startDateInput, endDateInput);
  };

  const handleClearDateRange = () => {
    setStartDateInput('');
    setEndDateInput('');
    handleDateRangeChange('', '');
  };

  if (loading && entries.length === 0) {
    return <Loading />;
  }

  return (
    <div className="diary-page">
      <div className="diary-header">
        <h1>My Diary</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {showForm && (
        <div className="diary-form-container">
          <h2>New Entry</h2>
          <DiaryEntryForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}

      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search diary entries..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn-clear"
            >
              Clear
            </button>
          )}
        </form>

        <form onSubmit={handleDateRangeSubmit} className="date-range-form">
          <div className="date-inputs">
            <input
              type="date"
              placeholder="Start Date"
              value={startDateInput}
              onChange={(e) => setStartDateInput(e.target.value)}
              className="date-input"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              placeholder="End Date"
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
              className="date-input"
            />
          </div>
          <button type="submit" className="btn-search">
            Filter by Date
          </button>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={handleClearDateRange}
              className="btn-clear"
            >
              Clear Dates
            </button>
          )}
        </form>

        {totalCount > 0 && (
          <div className="search-results-info">
            Showing {entries.length} of {totalCount} entries
          </div>
        )}
      </div>

      <div className="diary-entries">
        {entries.length === 0 ? (
          <div className="no-entries">
            <p>
              {searchTerm
                ? 'No entries found matching your search.'
                : 'No diary entries yet. Create your first entry!'}
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <DiaryEntryCard
              key={entry.id}
              entry={entry}
              isEditing={editingEntry === entry.id}
              onEdit={() => setEditingEntry(entry.id)}
              onCancelEdit={() => setEditingEntry(null)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              loading={loading}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber === 1 || loading}
            className="btn-pagination"
          >
            Previous
          </button>
          <div className="pagination-info">
            Page {pageNumber} of {totalPages}
          </div>
          <button
            onClick={() => goToPage(pageNumber + 1)}
            disabled={pageNumber === totalPages || loading}
            className="btn-pagination"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
