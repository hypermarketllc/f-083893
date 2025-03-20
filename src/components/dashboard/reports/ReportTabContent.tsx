
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PLReport from './PLReport';

interface ReportTabContentProps {
  reportType: 'pandl' | 'calls' | 'leads' | 'agents' | 'pubs';
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({ reportType }) => {
  return (
    <>
      <TabsContent value="pandl" className="mt-4">
        <PLReport />
      </TabsContent>
      
      <TabsContent value="calls" className="mt-4">
        <div className="py-4 text-center text-muted-foreground">
          <p>Call reports coming soon</p>
        </div>
      </TabsContent>
      
      <TabsContent value="leads" className="mt-4">
        <div className="py-4 text-center text-muted-foreground">
          <p>Leads reports coming soon</p>
        </div>
      </TabsContent>
      
      <TabsContent value="agents" className="mt-4">
        <div className="py-4 text-center text-muted-foreground">
          <p>Agent reports coming soon</p>
        </div>
      </TabsContent>
      
      <TabsContent value="pubs" className="mt-4">
        <div className="py-4 text-center text-muted-foreground">
          <p>Pubs reports coming soon</p>
        </div>
      </TabsContent>
    </>
  );
};

export default ReportTabContent;
