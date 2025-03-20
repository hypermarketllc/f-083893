
import React from 'react';
import { Webhook2Provider } from '@/contexts/webhook2/Webhook2Context';
import { Webhook2Page } from '@/components/webhook2/Webhook2Page';

const Webhook2Section: React.FC = () => {
  return (
    <Webhook2Provider>
      <div className="animate-in fade-in duration-300">
        <Webhook2Page />
      </div>
    </Webhook2Provider>
  );
};

export default Webhook2Section;
