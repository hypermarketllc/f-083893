
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry } from '@/types/webhook';
import { Table, TableBody } from '@/components/ui/table';
import { LogsTableHeader } from './logs/LogsTableHeader';
import { LogRow } from './logs/LogRow';
import { LogDetailsModal } from './logs/LogDetailsModal';
import { EmptyLogs } from './logs/EmptyLogs';

export const WebhookLogsTable: React.FC = () => {
  const { webhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewLog = (log: WebhookLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (webhookLogs.length === 0) {
    return <EmptyLogs message="No webhook logs found" />;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <LogsTableHeader />
          <TableBody>
            {webhookLogs.map((log) => (
              <LogRow 
                key={log.id} 
                log={log} 
                onView={handleViewLog} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <LogDetailsModal
        log={selectedLog}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
