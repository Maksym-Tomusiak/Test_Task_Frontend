import React, { useState } from 'react';
import type { DiaryEntry } from '../../types';
import { diaryService } from '../../services';
import DiaryEntryForm from './DiaryEntryForm';
import './DiaryEntryCard.css';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (
    id: string,
    content: string,
    image?: File,
    deleteCurrentImage?: boolean
  ) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({
  entry,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  loading,
}) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (entry.hasImage && entry.imageId) {
      diaryService
        .getEntryImage(entry.imageId)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        })
        .catch((err) => {
          console.error('Failed to load image:', err);
        });
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [entry.hasImage, entry.imageId]);

  const handleUpdate = (
    content: string,
    image?: File,
    deleteCurrentImage?: boolean
  ) => {
    onUpdate(entry.id, content, image, deleteCurrentImage);
  };

  const formattedDate = new Date(entry.entryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isEditing) {
    return (
      <div className="diary-entry-card editing">
        <h3>Edit Entry</h3>
        <DiaryEntryForm
          initialContent={entry.content}
          hasExistingImage={entry.hasImage}
          onSubmit={handleUpdate}
          onCancel={onCancelEdit}
          loading={loading}
          isEditing
        />
      </div>
    );
  }

  return (
    <div className="diary-entry-card">
      <div className="entry-header">
        <span className="entry-date">{formattedDate}</span>
        <div className="entry-actions">
          <button className="btn-edit" onClick={onEdit} disabled={loading}>
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(entry.id)}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="entry-content">
        <p>{entry.content}</p>
      </div>

      {entry.hasImage && imageUrl && (
        <div className="entry-image">
          <img
            src={imageUrl}
            alt="Entry"
            onClick={() => setShowFullImage(true)}
          />
        </div>
      )}

      {showFullImage && entry.hasImage && imageUrl && (
        <div className="image-modal" onClick={() => setShowFullImage(false)}>
          <div className="modal-content">
            <span className="close">&times;</span>
            <img src={imageUrl} alt="Entry Full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryEntryCard;
