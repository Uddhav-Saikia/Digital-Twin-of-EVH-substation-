import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, AlertCircle } from 'lucide-react';
import './Reports.css';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

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
          <button className="btn-primary">Create Report</button>
        </div>

        <div className="action-card">
          <Calendar size={32} className="action-icon" />
          <h3>Schedule Automated Reports</h3>
          <p>Set up automatic report generation and email delivery</p>
          <button className="btn-secondary">Configure Schedule</button>
        </div>

        <div className="action-card">
          <TrendingUp size={32} className="action-icon" />
          <h3>Executive Dashboard</h3>
          <p>High-level KPIs and summary for management review</p>
          <button className="btn-secondary">View Dashboard</button>
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
                <button className="btn-secondary">
                  <Download size={16} />
                  Download Latest
                </button>
                <button className="btn-primary">
                  Generate New
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
            <button className="btn-secondary">Use Template</button>
          </div>
          <div className="template-card">
            <h3>Executive Summary</h3>
            <p>Condensed format for executive review</p>
            <button className="btn-secondary">Use Template</button>
          </div>
          <div className="template-card">
            <h3>Technical Detailed</h3>
            <p>Comprehensive technical report with all data</p>
            <button className="btn-secondary">Use Template</button>
          </div>
          <div className="template-card">
            <h3>Custom Template</h3>
            <p>Create your own template with selected sections</p>
            <button className="btn-primary">Create New</button>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h2>Export Formats</h2>
        <div className="export-options">
          <div className="export-option">
            <input type="checkbox" id="pdf" defaultChecked />
            <label htmlFor="pdf">PDF Document</label>
          </div>
          <div className="export-option">
            <input type="checkbox" id="excel" />
            <label htmlFor="excel">Excel Spreadsheet</label>
          </div>
          <div className="export-option">
            <input type="checkbox" id="csv" />
            <label htmlFor="csv">CSV Data</label>
          </div>
          <div className="export-option">
            <input type="checkbox" id="json" />
            <label htmlFor="json">JSON (API)</label>
          </div>
        </div>
      </div>

      {/* Placeholder Section */}
      <div className="placeholder-section">
        <h3>📊 Advanced Reporting Features</h3>
        <div className="placeholder-grid">
          <div className="placeholder-card">
            <h4>Interactive BI Dashboard</h4>
            <p>Integration with Power BI or Tableau for advanced visualization and drill-down analysis</p>
            <span className="tech-note">Requires: Power BI Embedded, Tableau Server, or custom D3.js dashboards</span>
          </div>
          <div className="placeholder-card">
            <h4>Automated Report Distribution</h4>
            <p>Email reports to stakeholders with custom schedules and distribution lists</p>
            <span className="tech-note">Requires: Email service integration (SendGrid), scheduling engine, user preferences</span>
          </div>
          <div className="placeholder-card">
            <h4>Report Version Control</h4>
            <p>Track report revisions, compare historical reports, and maintain audit trails</p>
            <span className="tech-note">Requires: Version control system, diff engine, storage management</span>
          </div>
          <div className="placeholder-card">
            <h4>Natural Language Report Generation</h4>
            <p>AI-powered narrative generation to explain trends and anomalies in plain language</p>
            <span className="tech-note">Requires: NLG engine (GPT integration), template system, data interpretation layer</span>
          </div>
          <div className="placeholder-card">
            <h4>Benchmark Comparison</h4>
            <p>Compare performance against industry standards and similar substations</p>
            <span className="tech-note">Requires: Industry benchmark database, normalization algorithms, statistical analysis</span>
          </div>
          <div className="placeholder-card">
            <h4>Regulatory Report Automation</h4>
            <p>Auto-generate compliance reports in required formats (NERC, IEC, IEEE)</p>
            <span className="tech-note">Requires: Regulatory template library, data mapping, validation rules</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
