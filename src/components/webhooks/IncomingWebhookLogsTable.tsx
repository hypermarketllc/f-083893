
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhookLogEntry } from '@/types/webhook';
import { EmptyLogs } from './logs/EmptyLogs';
import { IncomingLogsTableHeader } from './logs/IncomingLogsTableHeader';
import { IncomingLogRow } from './logs/IncomingLogRow';
import { IncomingLogDetailsModal } from './logs/IncomingLogDetailsModal';
import { ensureIncomingLogEntryFields } from '@/contexts/webhook/webhookUtils';

interface IncomingWebhookLogsTableProps {
  compact?: boolean;
}

export const IncomingWebhookLogsTable: React.FC<IncomingWebhookLogsTableProps> = ({ compact }) => {
  const { incomingWebhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<IncomingWebhookLogEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (log: IncomingWebhookLogEntry) => {
    // Ensure all fields are present in the log entry
    setSelectedLog(ensureIncomingLogEntryFields(log));
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  if (!incomingWebhookLogs || incomingWebhookLogs.length === 0) {
    return <EmptyLogs message="No incoming webhook logs found" />;
  }

  return (
    <>
      <div className={`border rounded-md ${compact ? 'overflow-hidden' : ''}`}>
        <Table>
          <IncomingLogsTableHeader compact={compact} />
          <TableBody>
            {incomingWebhookLogs.map(log => (
              <IncomingLogRow
                key={log.id || 'placeholder-id'}
                log={ensureIncomingLogEntryFields(log)}
                onViewDetails={handleViewDetails}
                compact={compact}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <IncomingLogDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        log={selectedLog}
      />
    </>
  );
};
