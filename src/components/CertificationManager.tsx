import React, { useState } from 'react';
import { Certification } from '../types/training.types';
import { 
  X, 
  Award, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Download,
  ExternalLink,
  Clock
} from 'lucide-react';
import './CertificationManager.css';

interface CertificationManagerProps {
  certifications: Certification[];
  onClose: () => void;
}

const CertificationManager: React.FC<CertificationManagerProps> = ({ 
  certifications, 
  onClose 
}) => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [showExamDialog, setShowExamDialog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={20} className="status-icon active" />;
      case 'expiring':
        return <AlertCircle size={20} className="status-icon expiring" />;
      case 'expired':
        return <XCircle size={20} className="status-icon expired" />;
      default:
        return <Clock size={20} className="status-icon" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'expiring':
        return '#f59e0b';
      case 'expired':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getDaysUntilExpiry = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeCerts = certifications.filter(c => c.status === 'active');
  const expiringCerts = certifications.filter(c => c.status === 'expiring');
  const expiredCerts = certifications.filter(c => c.status === 'expired');

  // Certificate Detail View
  if (selectedCert) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="cert-detail-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="cert-detail-content">
            <div className="cert-detail-header">
              <div className="cert-badge">
                <Award size={48} />
              </div>
              <div className="cert-header-info">
                <h2>{selectedCert.name}</h2>
                <p className="cert-issuer">{selectedCert.issuer}</p>
                <div className="cert-status-badge" style={{ background: getStatusColor(selectedCert.status) }}>
                  {getStatusIcon(selectedCert.status)}
                  <span>{getStatusLabel(selectedCert.status)}</span>
                </div>
              </div>
            </div>

            <div className="cert-details-grid">
              <div className="cert-detail-item">
                <span className="detail-label">Credential ID</span>
                <span className="detail-value">{selectedCert.credentialId}</span>
              </div>
              <div className="cert-detail-item">
                <span className="detail-label">Issued Date</span>
                <span className="detail-value">
                  {new Date(selectedCert.validUntil).getFullYear() - 2} - {new Date(selectedCert.validUntil).getMonth() + 1}
                </span>
              </div>
              <div className="cert-detail-item">
                <span className="detail-label">Valid Until</span>
                <span className="detail-value">{selectedCert.validUntil}</span>
              </div>
              <div className="cert-detail-item">
                <span className="detail-label">Score Achieved</span>
                <span className="detail-value">{selectedCert.score}%</span>
              </div>
            </div>

            {selectedCert.description && (
              <div className="cert-description">
                <h3>About this Certification</h3>
                <p>{selectedCert.description}</p>
              </div>
            )}

            {selectedCert.requirements && (
              <div className="cert-requirements">
                <h3>Requirements</h3>
                <p>{selectedCert.requirements}</p>
              </div>
            )}

            <div className="cert-actions">
              <button className="cert-action-btn primary">
                <Download size={18} />
                Download Certificate
              </button>
              <button className="cert-action-btn secondary">
                <ExternalLink size={18} />
                Verify Online
              </button>
              {selectedCert.status === 'expiring' || selectedCert.status === 'expired' ? (
                <button 
                  className="cert-action-btn renew"
                  onClick={() => {
                    setShowExamDialog(true);
                  }}
                >
                  <Award size={18} />
                  Renew Certification
                </button>
              ) : null}
            </div>

            {selectedCert.status === 'expiring' && (
              <div className="cert-warning">
                <AlertCircle size={20} />
                <div>
                  <strong>Renewal Required</strong>
                  <p>This certification expires in {getDaysUntilExpiry(selectedCert.validUntil)} days. Please renew to maintain your credentials.</p>
                </div>
              </div>
            )}

            {selectedCert.status === 'expired' && (
              <div className="cert-error">
                <XCircle size={20} />
                <div>
                  <strong>Certification Expired</strong>
                  <p>This certification has expired. You must pass the renewal exam to reactivate your credentials.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Exam Registration Dialog
  if (showExamDialog) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="exam-dialog" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowExamDialog(false)}>
            <X size={24} />
          </button>

          <div className="exam-dialog-content">
            <div className="exam-icon">
              <Award size={64} />
            </div>
            <h2>Register for Renewal Exam</h2>
            <p className="exam-description">
              Schedule your certification renewal exam. The exam will cover updated content and industry best practices.
            </p>

            <div className="exam-info">
              <div className="exam-info-item">
                <span className="label">Duration</span>
                <span className="value">120 minutes</span>
              </div>
              <div className="exam-info-item">
                <span className="label">Questions</span>
                <span className="value">75</span>
              </div>
              <div className="exam-info-item">
                <span className="label">Passing Score</span>
                <span className="value">80%</span>
              </div>
              <div className="exam-info-item">
                <span className="label">Fee</span>
                <span className="value">$250</span>
              </div>
            </div>

            <div className="available-dates">
              <h3>Available Exam Dates</h3>
              <div className="dates-grid">
                <button className="date-option">
                  <Calendar size={18} />
                  <span>October 20, 2025</span>
                </button>
                <button className="date-option">
                  <Calendar size={18} />
                  <span>October 27, 2025</span>
                </button>
                <button className="date-option">
                  <Calendar size={18} />
                  <span>November 3, 2025</span>
                </button>
              </div>
            </div>

            <div className="exam-actions">
              <button className="exam-btn secondary" onClick={() => setShowExamDialog(false)}>
                Cancel
              </button>
              <button className="exam-btn primary">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Certifications List View
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cert-manager-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="cert-manager-content">
          <div className="cert-manager-header">
            <h2>My Certifications</h2>
            <p>Manage your professional certifications and credentials</p>
          </div>

          <div className="cert-stats">
            <div className="cert-stat-card active">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div>
                <span className="stat-number">{activeCerts.length}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
            <div className="cert-stat-card expiring">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div>
                <span className="stat-number">{expiringCerts.length}</span>
                <span className="stat-label">Expiring Soon</span>
              </div>
            </div>
            <div className="cert-stat-card expired">
              <div className="stat-icon">
                <XCircle size={24} />
              </div>
              <div>
                <span className="stat-number">{expiredCerts.length}</span>
                <span className="stat-label">Expired</span>
              </div>
            </div>
          </div>

          <div className="certifications-list">
            {certifications.length > 0 ? (
              certifications.map(cert => (
                <div 
                  key={cert.id} 
                  className={`cert-card ${cert.status}`}
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="cert-card-header">
                    <div className="cert-icon">
                      <Award size={32} />
                    </div>
                    <div className="cert-info">
                      <h3>{cert.name}</h3>
                      <p className="cert-issuer">{cert.issuer}</p>
                    </div>
                    <div className="cert-status-badge" style={{ background: getStatusColor(cert.status) }}>
                      {getStatusIcon(cert.status)}
                      <span>{getStatusLabel(cert.status)}</span>
                    </div>
                  </div>

                  <div className="cert-card-details">
                    <div className="cert-detail-row">
                      <span className="label">Credential ID:</span>
                      <span className="value">{cert.credentialId}</span>
                    </div>
                    <div className="cert-detail-row">
                      <span className="label">Valid Until:</span>
                      <span className="value">{cert.validUntil}</span>
                    </div>
                    <div className="cert-detail-row">
                      <span className="label">Score:</span>
                      <span className="value">{cert.score}%</span>
                    </div>
                  </div>

                  {cert.status === 'expiring' && (
                    <div className="cert-card-warning">
                      <AlertCircle size={16} />
                      <span>Expires in {getDaysUntilExpiry(cert.validUntil)} days</span>
                    </div>
                  )}

                  {cert.status === 'expired' && (
                    <div className="cert-card-error">
                      <XCircle size={16} />
                      <span>Renewal required</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-certifications">
                <Award size={64} />
                <h3>No Certifications Yet</h3>
                <p>Complete courses and pass exams to earn professional certifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationManager;
