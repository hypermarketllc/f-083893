
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import ReportTabs from './reports/ReportTabs';
import ReportTabContent from './reports/ReportTabContent';

const ReportsSection = () => {
  const [activeReport, setActiveReport] = useState('pandl');

  return (
    <div className="space-y-4">
      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <ReportTabs 
          activeReport={activeReport}
          onChangeReport={setActiveReport}
        />

        {/* P&L Report */}
        <ReportTabContent reportType="pandl" />

        {/* Calls Report */}
        <ReportTabContent reportType="calls" />

        {/* Leads Report */}
        <ReportTabContent reportType="leads" />

        {/* Agents Report */}
        <ReportTabContent reportType="agents" />

        {/* Pubs Report */}
        <ReportTabContent reportType="pubs" />
      </Tabs>
    </div>
  );
};

export default ReportsSection;
