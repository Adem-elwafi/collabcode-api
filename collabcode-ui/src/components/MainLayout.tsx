import React from 'react';
import CodeEditor, { type SaveStatus } from './CodeEditor';
import StatusBar from './StatusBar';

interface Props {
  roomId: string;
  currentUser: string;
  users: string[];
  saveStatus: SaveStatus;
  token: string;
  onUsersChange: React.Dispatch<React.SetStateAction<string[]>>;
  onSaveStatusChange: (status: SaveStatus) => void;
}

const UserList: React.FC<{ users: string[]; currentUser: string }> = ({ users, currentUser }) => {
  return (
    <aside className="userList">
      <div className="userList__title">Active Users</div>

      <div className="userList__self">You: {currentUser}</div>

      {users.length === 0 ? (
        <div className="userList__empty">No other users online</div>
      ) : (
        <ul className="userList__items">
          {users.map((user) => (
            <li key={user} className={user === currentUser ? 'userList__item userList__item--self' : 'userList__item'}>
              {user === currentUser ? `${user} (you)` : user}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

const MainLayout: React.FC<Props> = ({
  roomId,
  currentUser,
  users,
  saveStatus,
  token,
  onUsersChange,
  onSaveStatusChange,
}) => {
  return (
    <div className="mainLayout">
      <aside className="mainLayout__sidebar">
        <UserList users={users} currentUser={currentUser} />
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