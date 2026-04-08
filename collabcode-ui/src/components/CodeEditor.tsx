import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { OnChange } from '@monaco-editor/react';
import WebSocketService from '../services/WebSocketService';
import Breadcrumbs from './Breadcrumbs';

interface Props {
  roomId: string;
  token: string;
  onUsersChange: React.Dispatch<React.SetStateAction<string[]>>;
  onSaveStatusChange: (status: SaveStatus) => void;
}

export type SaveStatus = 'Idle' | 'Saving' | 'Saved';

type RoomEvent =
  | { type: 'JOIN'; sender: string }
  | { type: 'LEAVE'; sender: string }
  | { type: 'CODE_UPDATE'; content: string; sender: string };

const isRoomEvent = (payload: unknown): payload is RoomEvent => {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const event = payload as Partial<RoomEvent>;
  return typeof event.type === 'string' && typeof event.sender === 'string';
};

const CodeEditor: React.FC<Props> = ({ roomId, token, onUsersChange, onSaveStatusChange }) => {
  const [code, setCode] = useState<string>('// Start collaborating...');
  const lastReceivedCode = useRef<string>('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onUsersChange([]);
    onSaveStatusChange('Idle');
    WebSocketService.connect(token, () => {});

    const timeout = setTimeout(() => {
      WebSocketService.subscribeToRoom(roomId, (payload: unknown) => {
        if (!isRoomEvent(payload)) {
          return;
        }

        // Handle Presence Logic
        if (payload.type === 'JOIN') {
          onUsersChange((currentUsers) => Array.from(new Set([...currentUsers, payload.sender])));
        } else if (payload.type === 'LEAVE') {
          onUsersChange((currentUsers) => currentUsers.filter((user) => user !== payload.sender));
        }
        
        // Handle Code Sync
        if (payload.type === 'CODE_UPDATE' && payload.content !== lastReceivedCode.current) {
          lastReceivedCode.current = payload.content;
          setCode(payload.content);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      onSaveStatusChange('Idle');
      WebSocketService.disconnect();
    };
  }, [onSaveStatusChange, onUsersChange, roomId, token]);

  const handleEditorChange: OnChange = (value) => {
    const newCode = value || '';
    if (newCode !== lastReceivedCode.current) {
      // 1. Trigger Visual Save Status
      onSaveStatusChange('Saving');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => onSaveStatusChange('Saved'), 2500); // Buffer for backend save

      // 2. Sync Code
      lastReceivedCode.current = newCode;
      WebSocketService.sendCodeUpdate(roomId, newCode);
      setCode(newCode);
    }
  };

  return (
    <div className="codeEditorShell">
      <Breadcrumbs roomId={roomId} filePath="projects/collabcode/main.ts" />
      <div className="codeEditorShell__editor">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, Cascadia Code, Consolas, monospace',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;