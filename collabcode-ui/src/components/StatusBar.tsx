import React from 'react';
import type { SaveStatus } from './CodeEditor';

interface Props {
  roomId: string;
  saveStatus: SaveStatus;
}

const StatusBar: React.FC<Props> = ({ roomId, saveStatus }) => {
  return (
    <footer className="statusBar">
      <div className="statusBar__left">
        <span>Room: {roomId}</span>
        <span>UTF-8</span>
      </div>
      <div className="statusBar__right">{saveStatus}</div>
    </footer>
  );
};

export default StatusBar;