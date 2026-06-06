import React from 'react';

export default function UploadSuccessModal({ 
  isOpen, 
  onClose, 
  title = "Upload Success!", 
  message = "Your video project has been uploaded successfully and is now visible on your profile." 
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 99999 
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          background: '#FFFFFF', 
          width: '450px', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          position: 'relative', 
          padding: '40px 30px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'ordPopIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ordPopIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}} />
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#CCFF00', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto' 
          }}>
            <i className="fas fa-check" style={{ fontSize: '2.5rem', color: '#000033' }}></i>
          </div>
        </div>
        
        <h2 style={{ 
          fontWeight: '800', 
          marginBottom: '12px', 
          color: '#000033', 
          fontSize: '1.8rem',
          lineHeight: '1.2'
        }}>
          {title}
        </h2>
        
        <p style={{ 
          fontSize: '0.88rem', 
          color: '#666666', 
          marginBottom: '28px', 
          lineHeight: '1.5',
          padding: '0 10px'
        }}>
          {message}
        </p>
        
        <button 
          type="button"
          onClick={onClose}
          style={{ 
            width: '100%', 
            background: '#CCFF00', 
            color: '#000033', 
            border: 'none', 
            padding: '14px 0', 
            borderRadius: '50px', 
            fontWeight: '800', 
            fontSize: '1rem', 
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 12px rgba(204,255,0,0.3)',
            transition: 'transform 0.15s, background-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b3ff00'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CCFF00'}
        >
          Great!
        </button>
      </div>
    </div>
  );
}
