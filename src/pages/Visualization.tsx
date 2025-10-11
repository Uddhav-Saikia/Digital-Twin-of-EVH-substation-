import React, { useState } from 'react';
import { Box, Maximize, ZoomIn, ZoomOut, RotateCw, Layers, Eye, MapPin, Info } from 'lucide-react';
import Substation3DScene from '../components/Substation3DScene';
import './Visualization.css';

const Visualization: React.FC = () => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [selectedLayer, setSelectedLayer] = useState<string[]>(['transformers', 'breakers', 'busbars']);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [svgScale, setSvgScale] = useState(1);

  const layers = [
    { id: 'transformers', name: 'Transformers', color: '#3b82f6' },
    { id: 'breakers', name: 'Circuit Breakers', color: '#22c55e' },
    { id: 'isolators', name: 'Isolators', color: '#f59e0b' },
    { id: 'busbars', name: 'Bus Bars', color: '#ef4444' },
    { id: 'protection', name: 'Protection Zones', color: '#8b5cf6' },
    { id: 'sensors', name: 'Sensors', color: '#06b6d4' },
  ];

  const toggleLayer = (layerId: string) => {
    setSelectedLayer(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  // View control functions
  const handleZoomIn = () => {
    if (viewMode === '2d') {
      setSvgScale(prev => Math.min(prev * 1.2, 3));
    } else {
      setZoomLevel(prev => Math.min(prev * 1.2, 3));
    }
  };

  const handleZoomOut = () => {
    if (viewMode === '2d') {
      setSvgScale(prev => Math.max(prev / 1.2, 0.3));
    } else {
      setZoomLevel(prev => Math.max(prev / 1.2, 0.3));
    }
  };

  const handleResetView = () => {
    if (viewMode === '2d') {
      setSvgScale(1);
    } else {
      setZoomLevel(1);
      // Reset 3D camera to default position
      // This will be handled by the 3D scene component
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="visualization">
      <div className="page-header">
        <div>
          <h1>3D/2D Substation Visualization</h1>
          <p className="page-subtitle">Interactive visual representation of substation layout</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => setViewMode('2d')}
            >
              2D View
            </button>
            <button 
              className={`toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </button>
          </div>
        </div>
      </div>

      <div className="visualization-workspace">
        {/* Control Panel */}
        <div className="control-panel">
          <div className="control-section">
            <h3>
              <Layers size={18} />
              Layers
            </h3>
            <div className="layer-list">
              {layers.map(layer => (
                <label key={layer.id} className="layer-item">
                  <input 
                    type="checkbox" 
                    checked={selectedLayer.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                  />
                  <span className="layer-color" style={{ background: layer.color }}></span>
                  <span className="layer-name">{layer.name}</span>
                  <Eye size={16} className="layer-icon" />
                </label>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>View Controls</h3>
            <div className="control-buttons">
              <button className="control-btn" onClick={handleZoomIn}>
                <ZoomIn size={18} />
                Zoom In
              </button>
              <button className="control-btn" onClick={handleZoomOut}>
                <ZoomOut size={18} />
                Zoom Out
              </button>
              <button className="control-btn" onClick={handleResetView}>
                <RotateCw size={18} />
                Reset View
              </button>
              <button className="control-btn" onClick={handleFullscreen}>
                <Maximize size={18} />
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
            <div className="zoom-info">
              <span>Zoom: {Math.round((viewMode === '2d' ? svgScale : zoomLevel) * 100)}%</span>
            </div>
          </div>

          <div className="control-section">
            <h3>Asset Status Legend</h3>
            <div className="legend-list">
              <div className="legend-item">
                <span className="legend-dot operational"></span>
                <span>Operational</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot maintenance"></span>
                <span>Maintenance</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot fault"></span>
                <span>Fault</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot offline"></span>
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="visualization-canvas">
          {viewMode === '2d' ? (
            <div className="canvas-2d">
              {/* SVG-based 2D schematic diagram */}
              <svg 
                viewBox="0 0 1200 800" 
                className="schematic-svg"
                style={{ 
                  transform: `scale(${svgScale})`,
                  transformOrigin: 'center center'
                }}
              >
                {/* 400kV Bus */}
                <line x1="100" y1="200" x2="1100" y2="200" stroke="#ef4444" strokeWidth="8" />
                <text x="50" y="195" fill="#6b7280" fontSize="14">400kV Bus</text>
                
                {/* 220kV Bus */}
                <line x1="100" y1="500" x2="1100" y2="500" stroke="#f59e0b" strokeWidth="6" />
                <text x="50" y="495" fill="#6b7280" fontSize="14">220kV Bus</text>

                {/* Transformer T1 */}
                {selectedLayer.includes('transformers') && (
                  <g>
                    <circle cx="300" cy="350" r="40" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" className="asset-interactive" />
                    <text x="300" y="355" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">T1</text>
                    <text x="300" y="420" textAnchor="middle" fill="#6b7280" fontSize="12">TXF-001</text>
                    <line x1="300" y1="200" x2="300" y2="310" stroke="#6b7280" strokeWidth="2" />
                    <line x1="300" y1="390" x2="300" y2="500" stroke="#6b7280" strokeWidth="2" />
                  </g>
                )}

                {/* Transformer T2 */}
                {selectedLayer.includes('transformers') && (
                  <g>
                    <circle cx="600" cy="350" r="40" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" className="asset-interactive" />
                    <text x="600" y="355" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">T2</text>
                    <text x="600" y="420" textAnchor="middle" fill="#6b7280" fontSize="12">TXF-002</text>
                    <line x1="600" y1="200" x2="600" y2="310" stroke="#6b7280" strokeWidth="2" />
                    <line x1="600" y1="390" x2="600" y2="500" stroke="#6b7280" strokeWidth="2" />
                  </g>
                )}

                {/* Circuit Breakers */}
                {selectedLayer.includes('breakers') && (
                  <>
                    {/* CB-001 */}
                    <rect x="180" y="180" width="40" height="40" fill="#22c55e" stroke="#15803d" strokeWidth="2" className="asset-interactive" />
                    <text x="200" y="205" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CB1</text>
                    <text x="200" y="165" textAnchor="middle" fill="#6b7280" fontSize="10">CB-001</text>

                    {/* CB-002 */}
                    <rect x="480" y="180" width="40" height="40" fill="#22c55e" stroke="#15803d" strokeWidth="2" className="asset-interactive" />
                    <text x="500" y="205" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CB2</text>
                    <text x="500" y="165" textAnchor="middle" fill="#6b7280" fontSize="10">CB-002</text>

                    {/* CB-003 */}
                    <rect x="780" y="480" width="40" height="40" fill="#22c55e" stroke="#15803d" strokeWidth="2" className="asset-interactive" />
                    <text x="800" y="505" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CB3</text>
                    <text x="800" y="545" textAnchor="middle" fill="#6b7280" fontSize="10">CB-003</text>
                  </>
                )}

                {/* Isolators */}
                {selectedLayer.includes('isolators') && (
                  <>
                    <rect x="250" y="190" width="20" height="20" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                    <rect x="360" y="190" width="20" height="20" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                    <rect x="550" y="190" width="20" height="20" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                  </>
                )}

                {/* Outgoing Feeders */}
                <g>
                  <line x1="800" y1="500" x2="800" y2="650" stroke="#6b7280" strokeWidth="3" />
                  <text x="810" y="575" fill="#6b7280" fontSize="12">Feeder 1</text>
                  
                  <line x1="950" y1="500" x2="950" y2="650" stroke="#6b7280" strokeWidth="3" />
                  <text x="960" y="575" fill="#6b7280" fontSize="12">Feeder 2</text>
                </g>

                {/* Protection Zones (if layer enabled) */}
                {selectedLayer.includes('protection') && (
                  <>
                    <rect x="250" y="150" width="200" height="250" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                    <text x="350" y="140" textAnchor="middle" fill="#8b5cf6" fontSize="11">Zone 1</text>
                    
                    <rect x="550" y="150" width="200" height="250" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                    <text x="650" y="140" textAnchor="middle" fill="#8b5cf6" fontSize="11">Zone 2</text>
                  </>
                )}

                {/* Sensors */}
                {selectedLayer.includes('sensors') && (
                  <>
                    <circle cx="280" cy="280" r="6" fill="#06b6d4" className="sensor-dot" />
                    <circle cx="320" cy="280" r="6" fill="#06b6d4" className="sensor-dot" />
                    <circle cx="580" cy="280" r="6" fill="#06b6d4" className="sensor-dot" />
                    <circle cx="620" cy="280" r="6" fill="#06b6d4" className="sensor-dot" />
                  </>
                )}
              </svg>

              {/* 2D Info Panel */}
              <div className="canvas-info">
                <div className="info-item">
                  <span>Scale:</span>
                  <span>1:100</span>
                </div>
                <div className="info-item">
                  <span>Assets Visible:</span>
                  <span>{selectedLayer.length * 3}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="canvas-3d">
              <div className="substation-3d-wrapper">
                <Substation3DScene 
                  zoomLevel={zoomLevel}
                  onResetView={handleResetView}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Asset Info Panel (when asset clicked) */}
      <div className="asset-info-panel" style={{ display: 'none' }}>
        <h3>Asset Information</h3>
        <div className="asset-info-content">
          <p>Click on any asset in the diagram to view details</p>
        </div>
      </div>

      
    </div>
  );
};

export default Visualization;
