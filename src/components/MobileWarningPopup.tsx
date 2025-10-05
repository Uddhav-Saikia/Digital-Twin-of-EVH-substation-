import React, { useState, useEffect } from 'react';
import { X, Monitor, Smartphone } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import './MobileWarningPopup.css';

const MobileWarningPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    // Detect if user is on a mobile device
    const checkMobileDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth < 768;
      setIsMobileDevice(isMobile);
    };

    checkMobileDevice();
    
    window.addEventListener('resize', () => {
      checkMobileDevice();
      // Also check if we should show popup on resize
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth < 768;
      if (isMobile && !isVisible) {
        checkAndShowPopup();
      }
    });

    // Show popup only on mobile devices
    let timer: NodeJS.Timeout | null = null;
    
    // Check if user is on mobile device before showing popup
    const checkAndShowPopup = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth < 768;
      
      if (isMobile) {
        // Add a small delay to ensure the page has loaded
        timer = setTimeout(() => {
          setIsVisible(true);
        }, 500);
      }
    };
    
    checkAndShowPopup();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      window.removeEventListener('resize', checkMobileDevice);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleContinue = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`mobile-warning-overlay ${isDarkMode ? 'dark' : ''}`}>
      <div className={`mobile-warning-popup ${isDarkMode ? 'dark' : ''}`}>
        <div className="mobile-warning-header">
          <div className="warning-icon">
            <Monitor size={32} />
          </div>
          <h2>Desktop Experience Recommended</h2>
          <button 
            className="close-button"
            onClick={handleDismiss}
            aria-label="Close warning"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mobile-warning-content">
          <div className="warning-message">
            <p>
              <strong>
                You're currently viewing on a mobile device. This application is optimized for large screens and desktop viewing.
              </strong>
            </p>
            <p>
              For the best experience with this digital twin application, please switch to a desktop or laptop computer with a screen resolution of 1920x1080 or higher.
            </p>
          </div>
          
          <div className="device-comparison">
            <div className="device-item recommended">
              <Monitor size={24} />
              <span>Desktop/Laptop</span>
              <small>Recommended</small>
            </div>
            <div className="device-item not-recommended">
              <Smartphone size={24} />
              <span>Mobile/Tablet</span>
              <small>Not optimized</small>
            </div>
          </div>
        </div>
        
        <div className="mobile-warning-actions">
          <button 
            className="btn-secondary"
            onClick={handleDismiss}
          >
            Continue Anyway
          </button>
          <button 
            className="btn-primary"
            onClick={handleContinue}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileWarningPopup;
