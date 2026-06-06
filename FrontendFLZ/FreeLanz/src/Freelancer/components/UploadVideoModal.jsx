import React, { useState } from 'react';

export default function UploadVideoModal({ isOpen, onClose, onSubmit }) {
  const [selectedFileName, setSelectedFileName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = () => {
    onSubmit();
    setSelectedFileName(''); // reset selected file state
  };

  const handleFormClose = () => {
    onClose();
    setSelectedFileName(''); // reset selected file state
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99998,
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleFormClose}
    >
      <div 
        style={{
          background: 'white',
          width: '440px',
          borderRadius: '40px',
          overflow: 'hidden',
          color: '#000',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lime Header Banner */}
        <div 
          style={{
            background: '#CCFF00',
            height: '55px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 22px'
          }}
        >
          <span 
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#000'
            }}
            onClick={handleFormClose}
          >
            &times;
          </span>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '25px 30px 30px', textAlign: 'center' }}>
          <h2 
            style={{
              fontSize: '1.6rem',
              fontWeight: '800',
              marginBottom: '8px',
              color: '#000'
            }}
          >
            Upload Video Project
          </h2>
          <p 
            style={{
              fontSize: '0.78rem',
              color: '#888',
              marginBottom: '20px',
              lineHeight: '1.4'
            }}
          >
            Share your project details to showcase your skills.
          </p>

          {/* Dropzone */}
          <div 
            style={{
              background: selectedFileName ? '#F6FFED' : '#F0F4FF',
              border: selectedFileName ? '2px dashed #52C41A' : '2px dashed #2F54EB',
              borderRadius: '14px',
              padding: '22px',
              marginBottom: '16px',
              cursor: 'pointer',
              color: selectedFileName ? '#52C41A' : '#2F54EB',
              transition: 'all 0.3s ease'
            }}
            onClick={() => document.getElementById('modalFileInput')?.click()}
          >
            {selectedFileName ? (
              <>
                <i className="fas fa-check-circle" style={{ fontSize: '1.8rem', marginBottom: '8px', display: 'block', color: '#52C41A' }}></i>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#52C41A' }}>
                  Uploaded
                </p>
                <p style={{ 
                  fontSize: '0.7rem', 
                  color: '#666666', 
                  marginTop: '4px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  maxWidth: '350px',
                  margin: '4px auto 0'
                }}>
                  {selectedFileName}
                </p>
                <span style={{ fontSize: '0.65rem', color: '#2F54EB', textDecoration: 'underline', display: 'inline-block', marginTop: '8px' }}>
                  Change Video
                </span>
              </>
            ) : (
              <>
                <i className="fas fa-upload" style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'block' }}></i>
                <p style={{ fontSize: '0.72rem', fontWeight: '600', color: '#000' }}>
                  Drag your video here or click to <span style={{ color: '#2F54EB', textDecoration: 'underline' }}>upload</span>
                </p>
              </>
            )}
            <input type="file" id="modalFileInput" hidden accept="video/*" onChange={handleFileChange} />
          </div>

          {/* Video Name Input */}
          <div style={{ textAlign: 'left', marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.82rem', marginBottom: '6px' }}>
              Video Name
            </label>
            <input 
              type="text" 
              placeholder="Christmas Video Editing" 
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '2px solid #000',
                borderRadius: '10px',
                fontWeight: '600',
                outline: 'none',
                fontFamily: "'Inter', sans-serif"
              }}
            />
          </div>

          {/* Description Textarea */}
          <div style={{ textAlign: 'left', marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.82rem', marginBottom: '6px' }}>
              Description
            </label>
            <textarea 
              placeholder="High-quality edits with festive effects, smooth transitions..."
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '2px solid #000',
                borderRadius: '10px',
                fontWeight: '600',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
                height: '100px',
                resize: 'none',
                background: '#F8F8F8'
              }}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="button"
            onClick={handleFormSubmit}
            style={{
              background: '#CCFF00',
              color: '#000',
              border: 'none',
              width: '70%',
              padding: '14px',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '0.95rem',
              marginTop: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(204,255,0,0.3)',
              transition: 'transform 0.15s, background-color 0.15s',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b3ff00'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CCFF00'}
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
}
