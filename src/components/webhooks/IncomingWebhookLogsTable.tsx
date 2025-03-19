
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhookLogEntry } from '@/types/webhook';
import { Table, TableBody } from '@/components/ui/table';
import { IncomingLogsTableHeader } from './logs/IncomingLogsTableHeader';
import { IncomingLogRow } from './logs/IncomingLogRow';
import { IncomingLogDetailsModal } from './logs/IncomingLogDetailsModal';
import { EmptyLogs } from './logs/EmptyLogs';

export const IncomingWebhookLogsTable: React.FC = () => {
  const { incomingWebhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<IncomingWebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewLog = (log: IncomingWebhookLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (incomingWebhookLogs.length === 0) {
    return <EmptyLogs message="No incoming webhook logs found" />;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <IncomingLogsTableHeader />
          <TableBody>
            {incomingWebhookLogs.map((log) => (
              <IncomingLogRow 
                key={log.id} 
                log={log} 
                onView={handleViewLog} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <IncomingLogDetailsModal
        log={selectedLog}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
