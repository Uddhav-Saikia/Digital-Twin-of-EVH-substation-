import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, AlertCircle, X, Check } from 'lucide-react';
import { mockTransformers, mockCircuitBreakers, mockMaintenanceRecords, generateSCADAData } from '../data/mockData';
import './Reports.css';

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  data: any;
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customReportConfig, setCustomReportConfig] = useState({
    title: '',
    dateRange: '7',
    includeAssets: true,
    includeMaintenance: true,
    includeScada: true,
    includeAnalytics: false
  });

  const reportTypes = [
    {
      id: 'asset-health',
      title: 'Asset Health Report',
      description: 'Comprehensive health assessment of all substation assets',
      category: 'Operations',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Summary',
      description: 'Completed and scheduled maintenance activities',
      category: 'Maintenance',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01'
    },
    {
      id: 'scada-performance',
      title: 'SCADA Performance',
      description: 'System availability, alarms, and operational metrics',
      category: 'Operations',
      frequency: 'Weekly',
      lastGenerated: '2025-09-30'
    },
    {
      id: 'energy',
      title: 'Energy Flow Analysis',
      description: 'Power consumption, losses, and efficiency metrics',
      category: 'Analytics',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01'
    },
    {
      id: 'compliance',
      title: 'Regulatory Compliance',
      description: 'Compliance with grid codes and safety regulations',
      category: 'Compliance',
      frequency: 'Quarterly',
      lastGenerated: '2025-09-01'
    },
    {
      id: 'incidents',
      title: 'Incident Report',
      description: 'All faults, trips, and abnormal events',
      category: 'Operations',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01'
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics Summary',
      description: 'AI/ML predictions and anomaly detection results',
      category: 'Analytics',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01'
    },
    {
      id: 'financial',
      title: 'Cost Analysis',
      description: 'Maintenance costs, energy costs, and budget tracking',
      category: 'Financial',
      frequency: 'Quarterly',
      lastGenerated: '2025-09-01'
    }
  ];

  const categories = ['All', 'Operations', 'Maintenance', 'Analytics', 'Compliance', 'Financial'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredReports = selectedCategory === 'All' 
    ? reportTypes 
    : reportTypes.filter(r => r.category === selectedCategory);

  const generateReportData = (reportId: string) => {
    const scadaData = generateSCADAData(24);
    
    switch(reportId) {
      case 'asset-health':
        return {
          totalAssets: mockTransformers.length + mockCircuitBreakers.length,
          avgHealth: ((mockTransformers.reduce((sum, t) => sum + t.health, 0) + 
                       mockCircuitBreakers.reduce((sum, cb) => sum + cb.health, 0)) / 
                      (mockTransformers.length + mockCircuitBreakers.length)).toFixed(1),
          criticalAssets: [...mockTransformers, ...mockCircuitBreakers].filter(a => a.health < 75).length,
          assets: [...mockTransformers.slice(0, 3), ...mockCircuitBreakers.slice(0, 3)]
        };
      case 'maintenance':
        return {
          total: mockMaintenanceRecords.length,
          completed: mockMaintenanceRecords.filter(m => m.status === 'completed').length,
          scheduled: mockMaintenanceRecords.filter(m => m.status === 'scheduled').length,
          overdue: mockMaintenanceRecords.filter(m => m.status === 'overdue').length,
          records: mockMaintenanceRecords.slice(0, 5)
        };
      case 'scada-performance':
        return {
          avgVoltage: (scadaData.reduce((sum, d) => sum + d.voltage_l1, 0) / scadaData.length).toFixed(2),
          avgPower: (scadaData.reduce((sum, d) => sum + d.activePower, 0) / scadaData.length).toFixed(2),
          avgFrequency: (scadaData.reduce((sum, d) => sum + d.frequency, 0) / scadaData.length).toFixed(3),
          dataPoints: scadaData.length
        };
      default:
        return { message: 'Report data generated successfully' };
    }
  };

  const handleDownload = (reportId: string, reportTitle: string, data?: any) => {
    const reportData = data || generateReportData(reportId);
    const reportContent = `
${reportTitle}
Generated on: ${new Date().toLocaleString()}
=====================================

${JSON.stringify(reportData, null, 2)}

This is a demonstration report with sample data.
    `;
    
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent);
    link.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = (reportId: string, reportTitle: string, reportType: string) => {
    setIsGenerating(reportId);
    
    // Simulate report generation
    setTimeout(() => {
      const reportData = generateReportData(reportId);
      const newReport: GeneratedReport = {
        id: `${reportId}-${Date.now()}`,
        title: reportTitle,
        type: reportType,
        generatedDate: new Date().toISOString(),
        data: reportData
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(null);
    }, 2000);
  };

  const handleCustomReportGenerate = () => {
    if (!customReportConfig.title) {
      alert('Please enter a report title');
      return;
    }
    
    setIsGenerating('custom');
    setTimeout(() => {
      const reportData: any = {};
      
      if (customReportConfig.includeAssets) {
        reportData.assets = generateReportData('asset-health');
      }
      if (customReportConfig.includeMaintenance) {
        reportData.maintenance = generateReportData('maintenance');
      }
      if (customReportConfig.includeScada) {
        reportData.scada = generateReportData('scada-performance');
      }
      
      const newReport: GeneratedReport = {
        id: `custom-${Date.now()}`,
        title: customReportConfig.title,
        type: 'Custom',
        generatedDate: new Date().toISOString(),
        data: reportData
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(null);
      setShowCustomReportModal(false);
      setCustomReportConfig({
        title: '',
        dateRange: '7',
        includeAssets: true,
        includeMaintenance: true,
        includeScada: true,
        includeAnalytics: false
      });
    }, 2000);
  };

  const handleTemplateUse = (templateType: string) => {
    setSelectedTemplate(templateType);
    setShowTemplateModal(true);
  };

  const handleTemplateGenerate = () => {
    if (!selectedTemplate) return;
    
    const templateTitles: Record<string, string> = {
      standard: 'Standard Report',
      executive: 'Executive Summary',
      technical: 'Technical Detailed Report'
    };
    
    setIsGenerating(selectedTemplate);
    setTimeout(() => {
      const reportData = {
        template: selectedTemplate,
        ...generateReportData('asset-health'),
        maintenance: generateReportData('maintenance'),
        scada: generateReportData('scada-performance')
      };
      
      const newReport: GeneratedReport = {
        id: `${selectedTemplate}-${Date.now()}`,
        title: templateTitles[selectedTemplate] || 'Template Report',
        type: 'Template',
        generatedDate: new Date().toISOString(),
        data: reportData
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(null);
      setShowTemplateModal(false);
      setSelectedTemplate(null);
    }, 2000);
  };

  return (
    <div className="reports">
      <div className="page-header">
        <div>
          <h1>Reports & Documentation</h1>
          <p className="page-subtitle">Generate and download operational reports</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card">
          <FileText size={32} className="action-icon" />
          <h3>Generate Custom Report</h3>
          <p>Create a customized report with selected metrics and date range</p>
          <button className="btn-primary" onClick={() => setShowCustomReportModal(true)}>Create Report</button>
        </div>

        <div className="action-card">
          <TrendingUp size={32} className="action-icon" />
          <h3>Generated Reports</h3>
          <p>View and download previously generated reports</p>
          <button className="btn-secondary" onClick={() => {
            document.getElementById('generated-reports')?.scrollIntoView({ behavior: 'smooth' });
          }}>View Reports ({generatedReports.length})</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <Filter size={18} />
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Report List */}
      <div className="reports-grid">
        {filteredReports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-icon">
              <FileText size={32} />
            </div>
            <div className="report-content">
              <h3>{report.title}</h3>
              <p className="report-description">{report.description}</p>
              
              <div className="report-meta">
                <span className="report-category">{report.category}</span>
                <span className="report-frequency">{report.frequency}</span>
              </div>

              <div className="report-date">
                Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
              </div>

              <div className="report-actions">
                <button 
                  className="btn-primary"
                  onClick={() => handleGenerate(report.id, report.title, report.category)}
                  disabled={isGenerating === report.id}
                >
                  {isGenerating === report.id ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Templates */}
      <div className="templates-section">
        <h2>Report Templates</h2>
        <div className="templates-grid">
          <div className="template-card">
            <h3>Standard Template</h3>
            <p>Default format with all standard sections</p>
            <button 
              className="btn-secondary" 
              onClick={() => handleTemplateUse('standard')}
              disabled={isGenerating === 'standard'}
            >
              {isGenerating === 'standard' ? 'Generating...' : 'Use Template'}
            </button>
          </div>
          <div className="template-card">
            <h3>Executive Summary</h3>
            <p>Condensed format for executive review</p>
            <button 
              className="btn-secondary" 
              onClick={() => handleTemplateUse('executive')}
              disabled={isGenerating === 'executive'}
            >
              {isGenerating === 'executive' ? 'Generating...' : 'Use Template'}
            </button>
          </div>
          <div className="template-card">
            <h3>Technical Detailed</h3>
            <p>Comprehensive technical report with all data</p>
            <button 
              className="btn-secondary" 
              onClick={() => handleTemplateUse('technical')}
              disabled={isGenerating === 'technical'}
            >
              {isGenerating === 'technical' ? 'Generating...' : 'Use Template'}
            </button>
          </div>
          <div className="template-card">
            <h3>Custom Template</h3>
            <p>Create your own template with selected sections</p>
            <button className="btn-primary" onClick={() => setShowCustomReportModal(true)}>Create New</button>
          </div>
        </div>
      </div>

      {/* Generated Reports Section */}
      {generatedReports.length > 0 && (
        <div id="generated-reports" className="generated-reports-section">
          <h2>Recently Generated Reports</h2>
          <div className="generated-reports-list">
            {generatedReports.map(report => (
              <div key={report.id} className="generated-report-card">
                <div className="generated-report-icon">
                  <FileText size={32} />
                </div>
                <div className="generated-report-content">
                  <h3>{report.title}</h3>
                  <div className="generated-report-meta">
                    <span className="report-type-badge">{report.type}</span>
                    <span className="report-date">
                      {new Date(report.generatedDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="generated-report-summary">
                    {Object.keys(report.data).length} data sections included
                  </div>
                </div>
                <div className="generated-report-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => handleDownload(report.id, report.title, report.data)}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="modal-overlay" onClick={() => setShowCustomReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Custom Report</h2>
              <button className="modal-close" onClick={() => setShowCustomReportModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Report Title</label>
                <input
                  type="text"
                  placeholder="Enter report title"
                  value={customReportConfig.title}
                  onChange={(e) => setCustomReportConfig({...customReportConfig, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Date Range</label>
                <select
                  value={customReportConfig.dateRange}
                  onChange={(e) => setCustomReportConfig({...customReportConfig, dateRange: e.target.value})}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <div className="form-group">
                <label>Include Sections</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={customReportConfig.includeAssets}
                      onChange={(e) => setCustomReportConfig({...customReportConfig, includeAssets: e.target.checked})}
                    />
                    <Check size={16} />
                    <span>Asset Health Data</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={customReportConfig.includeMaintenance}
                      onChange={(e) => setCustomReportConfig({...customReportConfig, includeMaintenance: e.target.checked})}
                    />
                    <Check size={16} />
                    <span>Maintenance Records</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={customReportConfig.includeScada}
                      onChange={(e) => setCustomReportConfig({...customReportConfig, includeScada: e.target.checked})}
                    />
                    <Check size={16} />
                    <span>SCADA Performance</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={customReportConfig.includeAnalytics}
                      onChange={(e) => setCustomReportConfig({...customReportConfig, includeAnalytics: e.target.checked})}
                    />
                    <Check size={16} />
                    <span>Predictive Analytics</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCustomReportModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCustomReportGenerate}
                disabled={isGenerating === 'custom'}
              >
                {isGenerating === 'custom' ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Generation Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template</h2>
              <button className="modal-close" onClick={() => setShowTemplateModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>This will generate a report using the {selectedTemplate} template with current system data.</p>
              <div className="template-info">
                <h4>Included Sections:</h4>
                <ul>
                  <li><Check size={16} /> Asset Health Summary</li>
                  <li><Check size={16} /> Maintenance Overview</li>
                  <li><Check size={16} /> SCADA Performance</li>
                  {selectedTemplate === 'technical' && (
                    <>
                      <li><Check size={16} /> Detailed Technical Specifications</li>
                      <li><Check size={16} /> Trend Analysis</li>
                    </>
                  )}
                  {selectedTemplate === 'executive' && (
                    <li><Check size={16} /> Executive KPIs</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleTemplateGenerate}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
