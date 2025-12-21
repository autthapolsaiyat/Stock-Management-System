import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const FloatingHomeButton: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('floatingHomeVisible');
    return saved !== 'false'; // default to visible
  });
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    localStorage.setItem('floatingHomeVisible', String(isVisible));
  }, [isVisible]);

  const handleGoHome = () => {
    navigate('/intro');
  };

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  // Show toggle button when hidden
  if (!isVisible) {
    return (
      <Tooltip title="แสดงปุ่ม Home" placement="left">
        <div
          onClick={() => setIsVisible(true)}
          style={{
            position: 'fixed',
            bottom: 80,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 999,
            opacity: 0.5,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.5';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <MenuOutlined style={{ color: '#fff', fontSize: 14 }} />
        </div>
      </Tooltip>
    );
  }

  // Minimized state - just show small icon
  if (isMinimized) {
    return (
      <Tooltip title="กลับหน้าหลัก" placement="left">
        <div
          onClick={handleGoHome}
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 999,
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.4)';
          }}
        >
          <HomeOutlined style={{ color: '#fff', fontSize: 20 }} />
          
          {/* Expand button */}
          <div
            onClick={handleMinimize}
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid #1f2937',
            }}
          >
            <MenuOutlined style={{ color: '#fff', fontSize: 10 }} />
          </div>
        </div>
      </Tooltip>
    );
  }

  // Full state with label
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        zIndex: 999,
        animation: 'slideIn 0.3s ease',
      }}
    >
      {/* Main button with label */}
      <div
        onClick={handleGoHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px 10px 14px',
          borderRadius: 25,
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.4)';
        }}
      >
        <HomeOutlined style={{ color: '#fff', fontSize: 18 }} />
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
          หน้าหลัก
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 4,
        marginLeft: 6,
      }}>
        {/* Minimize button */}
        <Tooltip title="ย่อปุ่ม" placement="left">
          <div
            onClick={handleMinimize}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(55, 65, 81, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(55, 65, 81, 0.9)';
            }}
          >
            <MenuOutlined style={{ color: '#fff', fontSize: 10 }} />
          </div>
        </Tooltip>

        {/* Hide button */}
        <Tooltip title="ซ่อนปุ่ม" placement="left">
          <div
            onClick={handleHide}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(55, 65, 81, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(55, 65, 81, 0.9)';
            }}
          >
            <CloseOutlined style={{ color: '#fff', fontSize: 10 }} />
          </div>
        </Tooltip>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingHomeButton;
