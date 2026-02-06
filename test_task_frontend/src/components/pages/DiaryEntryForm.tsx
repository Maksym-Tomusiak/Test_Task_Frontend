import React, { useState } from 'react';
import './DiaryEntryForm.css';

interface DiaryEntryFormProps {
  initialContent?: string;
  hasExistingImage?: boolean;
  onSubmit: (
    content: string,
    image?: File,
    deleteCurrentImage?: boolean
  ) => void;
  onCancel: () => void;
  loading: boolean;
  isEditing?: boolean;
}

const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({
  initialContent = '',
  hasExistingImage = false,
  onSubmit,
  onCancel,
  loading,
  isEditing = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [deleteCurrentImage, setDeleteCurrentImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setDeleteCurrentImage(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (hasExistingImage) {
      setDeleteCurrentImage(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content, image || undefined, deleteCurrentImage);
  };

  return (
    <form onSubmit={handleSubmit} className="diary-entry-form">
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          disabled={loading}
          placeholder="Write your thoughts..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Image (optional)</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
        />

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="btn-remove-image"
            >
              Remove
            </button>
          </div>
        )}

        {isEditing &&
          hasExistingImage &&
          !imagePreview &&
          !deleteCurrentImage && (
            <div className="existing-image-info">
              <p>Current entry has an image</p>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn-remove-image"
              >
                Remove existing image
              </button>
            </div>
          )}

        {deleteCurrentImage && (
          <p className="delete-image-notice">Image will be removed on save</p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DiaryEntryForm;
