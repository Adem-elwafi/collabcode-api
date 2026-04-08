import React, { useEffect } from 'react';
import CodeEditor, { type SaveStatus } from './CodeEditor';
import StatusBar from './StatusBar';
import Sidebar from './Sidebar';

interface Props {
  roomId: string;
  currentUser: string;
  users: string[];
  saveStatus: SaveStatus;
  token: string;
  onUsersChange: React.Dispatch<React.SetStateAction<string[]>>;
  onSaveStatusChange: (status: SaveStatus) => void;
}

const MainLayout: React.FC<Props> = ({
  roomId,
  currentUser,
  users,
  saveStatus,
  token,
  onUsersChange,
  onSaveStatusChange,
}) => {
  useEffect(() => {
    document.title = `CollabCode | ${roomId}`;
  }, [roomId]);

  return (
    <div className="mainLayout">
      <aside className="mainLayout__sidebar">
        <Sidebar roomId={roomId} users={users} currentUser={currentUser} />
      </aside>

      <main className="mainLayout__content">
        <CodeEditor
          roomId={roomId}
          token={token}
          onUsersChange={onUsersChange}
          onSaveStatusChange={onSaveStatusChange}
        />
      </main>

      <StatusBar roomId={roomId} saveStatus={saveStatus} />
    </div>
  );
};

export default MainLayout;