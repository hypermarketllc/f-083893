
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry } from '@/types/webhook';
import { EmptyLogs } from './logs/EmptyLogs';
import { LogsTableHeader } from './logs/LogsTableHeader';
import { LogRow } from './logs/LogRow';
import { LogDetailsModal } from './logs/LogDetailsModal';

interface WebhookLogsTableProps {
  compact?: boolean;
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({ compact }) => {
  const { webhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (log: WebhookLogEntry) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  if (webhookLogs.length === 0) {
    return <EmptyLogs message="No webhook logs found" />;
  }

  return (
    <>
      <div className={`border rounded-md ${compact ? 'overflow-hidden' : ''}`}>
        <Table>
          <LogsTableHeader compact={compact} />
          <TableBody>
            {webhookLogs.map(log => (
              <LogRow
                key={log.id}
                log={log}
                onViewDetails={handleViewDetails}
                compact={compact}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <LogDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        log={selectedLog}
      />
    </>
  );
};
