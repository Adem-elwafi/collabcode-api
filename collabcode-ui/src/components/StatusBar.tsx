import React from 'react';
import { Cloud, CloudCheck, Hash } from 'lucide-react';
import type { SaveStatus } from './CodeEditor';

interface Props {
  roomId: string;
  saveStatus: SaveStatus;
}

const StatusBar: React.FC<Props> = ({ roomId, saveStatus }) => {
  const saveIcon = saveStatus === 'Saving' ? <Cloud size={14} aria-hidden="true" /> : <CloudCheck size={14} aria-hidden="true" />;

  return (
    <footer className="statusBar">
      <div className="statusBar__left">
        <span className="statusBar__item">
          <Hash size={14} aria-hidden="true" />
          <span>{roomId}</span>
        </span>
        <span>UTF-8</span>
      </div>
      <div className="statusBar__right">
        <span className="statusBar__item">
          {saveIcon}
          <span>{saveStatus}</span>
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;