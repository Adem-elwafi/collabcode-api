import { useState } from 'react';
import './App.css';
import MainLayout from './components/MainLayout';
import type { SaveStatus } from './components/CodeEditor';

function App() {
  // In a real app, you'd get these from a login state or URL params
  const testRoomId = "dsi-project-room-1";
  const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZGVtQGV4YW1wbGUuY29tIiwiaWF0IjoxNzc1NDE4MTY3LCJleHAiOjE3NzU1MDQ1Njd9.v2zE4IpDP-YTF4nFNeGkcOkMQYaGLLHbZduWyLjECII"; 
  const testCurrentUser = "Adem";
  const [users, setUsers] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('Idle');

  return (
    <MainLayout
      roomId={testRoomId}
      currentUser={testCurrentUser}
      users={users}
      saveStatus={saveStatus}
      token={testToken}
      onUsersChange={setUsers}
      onSaveStatusChange={setSaveStatus}
    />
  );
}

export default App;