import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { mockTransformers, mockCircuitBreakers, mockIsolators, mockCT_CVT, mockProtectionSystems } from '../data/mockData';
import './AssetManagement.css';

type AssetType = 'all' | 'transformers' | 'breakers' | 'isolators' | 'ct_cvt' | 'protection';

const AssetManagement: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AssetType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusClass = (status: string, health: number) => {
    if (status === 'fault' || status === 'maintenance') return 'status-warning';
    if (health >= 90) return 'status-excellent';
    if (health >= 75) return 'status-good';
    if (health >= 60) return 'status-fair';
    return 'status-poor';
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return '#22c55e';
    if (health >= 75) return '#3b82f6';
    if (health >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="asset-management">
      <div className="page-header">
        <div>
          <h1>Asset Management</h1>
          <p className="page-subtitle">Manage and monitor all substation equipment</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary">
            <Plus size={18} />
            Add Asset
          </button>
        </div>
      </div>

      {/* Asset Type Tabs */}
      <div className="asset-tabs">
        <button 
          className={`tab ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          All Assets
        </button>
        <button 
          className={`tab ${selectedType === 'transformers' ? 'active' : ''}`}
          onClick={() => setSelectedType('transformers')}
        >
          Transformers ({mockTransformers.length})
        </button>
        <button 
          className={`tab ${selectedType === 'breakers' ? 'active' : ''}`}
          onClick={() => setSelectedType('breakers')}
        >
          Circuit Breakers ({mockCircuitBreakers.length})
        </button>
        <button 
          className={`tab ${selectedType === 'isolators' ? 'active' : ''}`}
          onClick={() => setSelectedType('isolators')}
        >
          Isolators ({mockIsolators.length})
        </button>
        <button 
          className={`tab ${selectedType === 'ct_cvt' ? 'active' : ''}`}
          onClick={() => setSelectedType('ct_cvt')}
        >
          CT/CVT ({mockCT_CVT.length})
        </button>
        <button 
          className={`tab ${selectedType === 'protection' ? 'active' : ''}`}
          onClick={() => setSelectedType('protection')}
        >
          Protection ({mockProtectionSystems.length})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="asset-filters">
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search assets by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="fault">Fault</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Transformers */}
      {(selectedType === 'all' || selectedType === 'transformers') && (
        <div className="asset-section">
          <h2>Transformers</h2>
          <div className="asset-grid">
            {mockTransformers.map(transformer => (
              <Link 
                key={transformer.id} 
                to={`/assets/transformer/${transformer.id}`}
                className="asset-card"
              >
                <div className="asset-card-header">
                  <div>
                    <h3>{transformer.name}</h3>
                    <span className="asset-id">{transformer.id}</span>
                  </div>
                  <span className={`status-badge ${getStatusClass(transformer.status, transformer.health)}`}>
                    {transformer.status}
                  </span>
                </div>
                
                <div className="asset-specs">
                  <div className="spec-item">
                    <span className="spec-label">Type:</span>
                    <span className="spec-value">{transformer.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Rating:</span>
                    <span className="spec-value">{transformer.voltageRating}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Capacity:</span>
                    <span className="spec-value">{transformer.capacity}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Load:</span>
                    <span className="spec-value">{transformer.loadPercentage}%</span>
                  </div>
                </div>

                <div className="asset-health">
                  <div className="health-header">
                    <span>Health Score</span>
                    <span style={{ color: getHealthColor(transformer.health), fontWeight: 'bold' }}>
                      {transformer.health}%
                    </span>
                  </div>
                  <div className="health-bar">
                    <div 
                      className="health-fill" 
                      style={{ 
                        width: `${transformer.health}%`,
                        background: getHealthColor(transformer.health)
                      }}
                    />
                  </div>
                </div>

                {transformer.alerts.length > 0 && (
                  <div className="asset-alerts">
                    <span className="alert-count">{transformer.alerts.length} alert(s)</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Circuit Breakers */}
      {(selectedType === 'all' || selectedType === 'breakers') && (
        <div className="asset-section">
          <h2>Circuit Breakers</h2>
          <div className="asset-grid">
            {mockCircuitBreakers.map(breaker => (
              <Link 
                key={breaker.id} 
                to={`/assets/breaker/${breaker.id}`}
                className="asset-card"
              >
                <div className="asset-card-header">
                  <div>
                    <h3>{breaker.name}</h3>
                    <span className="asset-id">{breaker.id}</span>
                  </div>
                  <span className={`status-badge ${breaker.status === 'closed' ? 'status-good' : 'status-warning'}`}>
                    {breaker.status}
                  </span>
                </div>
                
                <div className="asset-specs">
                  <div className="spec-item">
                    <span className="spec-label">Type:</span>
                    <span className="spec-value">{breaker.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Voltage:</span>
                    <span className="spec-value">{breaker.voltageRating}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Current:</span>
                    <span className="spec-value">{breaker.currentRating}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Operations:</span>
                    <span className="spec-value">{breaker.operationCount}</span>
                  </div>
                </div>

                <div className="asset-health">
                  <div className="health-header">
                    <span>Health Score</span>
                    <span style={{ color: getHealthColor(breaker.health), fontWeight: 'bold' }}>
                      {breaker.health}%
                    </span>
                  </div>
                  <div className="health-bar">
                    <div 
                      className="health-fill" 
                      style={{ 
                        width: `${breaker.health}%`,
                        background: getHealthColor(breaker.health)
                      }}
                    />
                  </div>
                </div>

                {breaker.alerts.length > 0 && (
                  <div className="asset-alerts">
                    <span className="alert-count">{breaker.alerts.length} alert(s)</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Isolators */}
      {(selectedType === 'all' || selectedType === 'isolators') && (
        <div className="asset-section">
          <h2>Isolators</h2>
          <div className="asset-grid">
            {mockIsolators.map(isolator => (
              <Link 
                key={isolator.id} 
                to={`/assets/isolator/${isolator.id}`}
                className="asset-card"
              >
                <div className="asset-card-header">
                  <div>
                    <h3>{isolator.name}</h3>
                    <span className="asset-id">{isolator.id}</span>
                  </div>
                  <span className={`status-badge ${isolator.position === 'closed' ? 'status-good' : 'status-warning'}`}>
                    {isolator.position}
                  </span>
                </div>
                
                <div className="asset-specs">
                  <div className="spec-item">
                    <span className="spec-label">Type:</span>
                    <span className="spec-value">{isolator.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Voltage:</span>
                    <span className="spec-value">{isolator.voltageRating}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Operations:</span>
                    <span className="spec-value">{isolator.operationCount}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Resistance:</span>
                    <span className="spec-value">{isolator.contactResistance} µΩ</span>
                  </div>
                </div>

                <div className="asset-health">
                  <div className="health-header">
                    <span>Health Score</span>
                    <span style={{ color: getHealthColor(isolator.health), fontWeight: 'bold' }}>
                      {isolator.health}%
                    </span>
                  </div>
                  <div className="health-bar">
                    <div 
                      className="health-fill" 
                      style={{ 
                        width: `${isolator.health}%`,
                        background: getHealthColor(isolator.health)
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CT/CVT */}
      {(selectedType === 'all' || selectedType === 'ct_cvt') && (
        <div className="asset-section">
          <h2>Current & Voltage Transformers</h2>
          <div className="asset-grid">
            {mockCT_CVT.map(device => (
              <Link 
                key={device.id} 
                to={`/assets/ct_cvt/${device.id}`}
                className="asset-card"
              >
                <div className="asset-card-header">
                  <div>
                    <h3>{device.name}</h3>
                    <span className="asset-id">{device.id}</span>
                  </div>
                  <span className={`status-badge ${getStatusClass(device.status, device.health)}`}>
                    {device.status}
                  </span>
                </div>
                
                <div className="asset-specs">
                  <div className="spec-item">
                    <span className="spec-label">Type:</span>
                    <span className="spec-value">{device.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Voltage:</span>
                    <span className="spec-value">{device.voltageRating}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Accuracy:</span>
                    <span className="spec-value">{device.accuracy}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Ratio:</span>
                    <span className="spec-value">{device.ratio}</span>
                  </div>
                </div>

                <div className="asset-health">
                  <div className="health-header">
                    <span>Health Score</span>
                    <span style={{ color: getHealthColor(device.health), fontWeight: 'bold' }}>
                      {device.health}%
                    </span>
                  </div>
                  <div className="health-bar">
                    <div 
                      className="health-fill" 
                      style={{ 
                        width: `${device.health}%`,
                        background: getHealthColor(device.health)
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Protection Systems */}
      {(selectedType === 'all' || selectedType === 'protection') && (
        <div className="asset-section">
          <h2>Protection Systems</h2>
          <div className="asset-grid">
            {mockProtectionSystems.map(protection => (
              <Link 
                key={protection.id} 
                to={`/assets/protection/${protection.id}`}
                className="asset-card"
              >
                <div className="asset-card-header">
                  <div>
                    <h3>{protection.name}</h3>
                    <span className="asset-id">{protection.id}</span>
                  </div>
                  <span className={`status-badge ${protection.status === 'armed' ? 'status-good' : 'status-warning'}`}>
                    {protection.status}
                  </span>
                </div>
                
                <div className="asset-specs">
                  <div className="spec-item">
                    <span className="spec-label">Type:</span>
                    <span className="spec-value">{protection.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Zone:</span>
                    <span className="spec-value">{protection.protectionZone}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Relay:</span>
                    <span className="spec-value">{protection.relayModel}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Firmware:</span>
                    <span className="spec-value">{protection.firmwareVersion}</span>
                  </div>
                </div>

                <div className="asset-health">
                  <div className="health-header">
                    <span>Health Score</span>
                    <span style={{ color: getHealthColor(protection.health), fontWeight: 'bold' }}>
                      {protection.health}%
                    </span>
                  </div>
                  <div className="health-bar">
                    <div 
                      className="health-fill" 
                      style={{ 
                        width: `${protection.health}%`,
                        background: getHealthColor(protection.health)
                      }}
                    />
                  </div>
                </div>

                {protection.tripHistory.length > 0 && (
                  <div className="asset-alerts">
                    <span className="alert-count">{protection.tripHistory.length} trip(s)</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
