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
  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [lastGeneratedReportTitle, setLastGeneratedReportTitle] = useState<string>('');

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

  const generateCSVContent = (reportId: string, reportData: any): string => {
    let csv = '';
    
    switch(reportId) {
      case 'asset-health':
        csv = 'Asset ID,Asset Name,Type,Health (%),Status,Temperature (°C),Load (%),Last Maintenance\n';
        reportData.assets.forEach((asset: any) => {
          csv += `${asset.id},${asset.name},${asset.type},${asset.health},${asset.status},${asset.temperature || 'N/A'},${asset.loadPercentage || asset.operationCount || 'N/A'},${asset.lastMaintenance}\n`;
        });
        break;
      case 'maintenance':
        csv = 'Record ID,Asset ID,Asset Type,Description,Type,Priority,Status,Scheduled Date,Technician\n';
        reportData.records.forEach((record: any) => {
          csv += `${record.id},${record.assetId},${record.assetType},${record.description},${record.type},${record.priority},${record.status},${record.scheduledDate},${record.technician || 'N/A'}\n`;
        });
        break;
      case 'scada-performance':
        csv = 'Metric,Value,Unit\n';
        csv += `Average Voltage,${reportData.avgVoltage},kV\n`;
        csv += `Average Power,${reportData.avgPower},MW\n`;
        csv += `Average Frequency,${reportData.avgFrequency},Hz\n`;
        csv += `Data Points Collected,${reportData.dataPoints},count\n`;
        break;
      default:
        csv = 'Data\n' + JSON.stringify(reportData, null, 2);
    }
    
    return csv;
  };

  const generateDetailedReport = (reportId: string, reportTitle: string, reportData: any): string => {
    const date = new Date().toLocaleString();
    let content = '';
    
    content += '═══════════════════════════════════════════════════════════════════════\n';
    content += `  ${reportTitle.toUpperCase()}\n`;
    content += '═══════════════════════════════════════════════════════════════════════\n\n';
    content += `Generated on: ${date}\n`;
    content += `Report Period: ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}\n`;
    content += `Report Type: ${reportId}\n\n`;
    content += '───────────────────────────────────────────────────────────────────────\n\n';
    
    switch(reportId) {
      case 'asset-health':
        content += 'EXECUTIVE SUMMARY\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += `Total Assets Monitored: ${reportData.totalAssets}\n`;
        content += `Average Health Score: ${reportData.avgHealth}%\n`;
        content += `Critical Assets (Health < 75%): ${reportData.criticalAssets}\n\n`;
        
        content += 'DETAILED ASSET STATUS\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        reportData.assets.forEach((asset: any, index: number) => {
          content += `${index + 1}. ${asset.name} (${asset.id})\n`;
          content += `   Type: ${asset.type}\n`;
          content += `   Status: ${asset.status.toUpperCase()}\n`;
          content += `   Health Score: ${asset.health}%\n`;
          content += `   Temperature: ${asset.temperature || 'N/A'}°C\n`;
          if (asset.loadPercentage) {
            content += `   Load: ${asset.loadPercentage}%\n`;
          }
          if (asset.operationCount) {
            content += `   Operations: ${asset.operationCount}\n`;
          }
          content += `   Last Maintenance: ${asset.lastMaintenance}\n`;
          content += `   Next Maintenance: ${asset.nextMaintenance}\n`;
          if (asset.alerts && asset.alerts.length > 0) {
            content += `   Active Alerts: ${asset.alerts.length}\n`;
            asset.alerts.forEach((alert: any) => {
              content += `     - [${alert.severity.toUpperCase()}] ${alert.message}\n`;
            });
          }
          content += '\n';
        });
        break;
        
      case 'maintenance':
        content += 'MAINTENANCE SUMMARY\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += `Total Maintenance Records: ${reportData.total}\n`;
        content += `Completed: ${reportData.completed}\n`;
        content += `Scheduled: ${reportData.scheduled}\n`;
        content += `Overdue: ${reportData.overdue}\n\n`;
        
        content += 'RECENT MAINTENANCE ACTIVITIES\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        reportData.records.forEach((record: any, index: number) => {
          content += `${index + 1}. ${record.description}\n`;
          content += `   Asset: ${record.assetId} - ${record.assetType}\n`;
          content += `   Type: ${record.type.toUpperCase()}\n`;
          content += `   Priority: ${record.priority.toUpperCase()}\n`;
          content += `   Status: ${record.status.toUpperCase()}\n`;
          content += `   Scheduled: ${new Date(record.scheduledDate).toLocaleDateString()}\n`;
          content += `   Technician: ${record.technician || 'Not Assigned'}\n\n`;
        });
        break;
        
      case 'scada-performance':
        content += 'SCADA SYSTEM PERFORMANCE METRICS\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += `Average Voltage (L1): ${reportData.avgVoltage} kV\n`;
        content += `Average Active Power: ${reportData.avgPower} MW\n`;
        content += `Average Frequency: ${reportData.avgFrequency} Hz\n`;
        content += `Total Data Points Collected: ${reportData.dataPoints}\n\n`;
        content += 'SYSTEM STATUS: NORMAL\n';
        content += 'All parameters within acceptable ranges.\n';
        break;
        
      case 'energy':
        content += 'ENERGY FLOW ANALYSIS\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += 'This report provides detailed analysis of energy consumption,\n';
        content += 'power losses, and efficiency metrics for the reporting period.\n\n';
        content += `Total Energy Consumed: ${(Math.random() * 10000 + 5000).toFixed(2)} MWh\n`;
        content += `Peak Demand: ${(Math.random() * 500 + 200).toFixed(2)} MW\n`;
        content += `Average Load Factor: ${(Math.random() * 20 + 70).toFixed(2)}%\n`;
        content += `System Losses: ${(Math.random() * 3 + 1).toFixed(2)}%\n`;
        break;
        
      case 'compliance':
        content += 'REGULATORY COMPLIANCE REPORT\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += 'Compliance Status: COMPLIANT\n\n';
        content += 'Grid Code Requirements:\n';
        content += '  ✓ Voltage regulation within limits\n';
        content += '  ✓ Frequency stability maintained\n';
        content += '  ✓ Protection system coordination verified\n';
        content += '  ✓ Safety procedures followed\n\n';
        content += 'No compliance violations recorded during this period.\n';
        break;
        
      case 'incidents':
        content += 'INCIDENT REPORT\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += `Total Incidents: ${Math.floor(Math.random() * 5)}\n`;
        content += `Critical: 0\n`;
        content += `High: ${Math.floor(Math.random() * 2)}\n`;
        content += `Medium: ${Math.floor(Math.random() * 3)}\n\n`;
        content += 'All incidents have been investigated and resolved.\n';
        break;
        
      case 'predictive':
        content += 'PREDICTIVE ANALYTICS SUMMARY\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += 'AI/ML Model Performance:\n';
        content += `  Prediction Accuracy: ${(Math.random() * 5 + 92).toFixed(2)}%\n`;
        content += `  Anomalies Detected: ${Math.floor(Math.random() * 10)}\n`;
        content += `  False Positives: ${Math.floor(Math.random() * 3)}\n\n`;
        content += 'Recommended Actions:\n';
        content += '  - Schedule preventive maintenance for assets with declining health\n';
        content += '  - Monitor transformer TXF-001 for temperature trends\n';
        break;
        
      case 'financial':
        content += 'COST ANALYSIS REPORT\n';
        content += '═══════════════════════════════════════════════════════════════════════\n\n';
        content += `Total Maintenance Costs: $${(Math.random() * 50000 + 10000).toFixed(2)}\n`;
        content += `Energy Costs: $${(Math.random() * 100000 + 50000).toFixed(2)}\n`;
        content += `Operational Expenses: $${(Math.random() * 30000 + 10000).toFixed(2)}\n`;
        content += `Budget Utilization: ${(Math.random() * 15 + 75).toFixed(2)}%\n`;
        break;
        
      default:
        content += JSON.stringify(reportData, null, 2);
    }
    
    content += '\n\n───────────────────────────────────────────────────────────────────────\n';
    content += 'End of Report\n';
    content += 'Generated by EHV Substation Digital Twin System\n';
    content += '═══════════════════════════════════════════════════════════════════════\n';
    
    return content;
  };

  const handleDownload = (reportId: string, reportTitle: string, data?: any) => {
    const reportData = data || generateReportData(reportId);
    
    // Generate detailed text report
    const textContent = generateDetailedReport(reportId, reportTitle, reportData);
    
    // Generate CSV content
    const csvContent = generateCSVContent(reportId, reportData);
    
    // Generate JSON content
    const jsonContent = JSON.stringify({
      reportTitle,
      generatedDate: new Date().toISOString(),
      reportPeriod: selectedPeriod,
      reportType: reportId,
      data: reportData
    }, null, 2);
    
    // Create a zip-like experience by downloading multiple formats
    // Download detailed text report
    const textLink = document.createElement('a');
    textLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
    textLink.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
    
    // Also offer CSV download for data-heavy reports
    setTimeout(() => {
      const csvLink = document.createElement('a');
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      csvLink.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(csvLink);
      csvLink.click();
      document.body.removeChild(csvLink);
    }, 300);
    
    // And JSON for programmatic access
    setTimeout(() => {
      const jsonLink = document.createElement('a');
      jsonLink.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonContent);
      jsonLink.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
    }, 600);
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
      setLastGeneratedReportTitle(reportTitle);
      setShowConfirmationModal(true);
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
      setLastGeneratedReportTitle(customReportConfig.title);
      setShowConfirmationModal(true);
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
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Generated</h2>
              <button className="modal-close" onClick={() => setShowConfirmationModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>Your report <strong>{lastGeneratedReportTitle}</strong> has been successfully generated.</p>
              <p>You can download it from the <strong>Recently Generated Reports</strong> section below.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => {
                setShowConfirmationModal(false);
                document.getElementById('generated-reports')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Go to Reports
              </button>
            </div>
          </div>
        </div>
      )}
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
