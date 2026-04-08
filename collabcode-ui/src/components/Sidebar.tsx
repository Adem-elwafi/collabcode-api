import React, { useState } from 'react';
import { Hash, Share2 } from 'lucide-react';
import UserList from './UserList';

interface Props {
  roomId: string;
  users: string[];
  currentUser: string;
}

const Sidebar: React.FC<Props> = ({ roomId, users, currentUser }) => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?roomId=${encodeURIComponent(roomId)}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 1400);
    } catch {
      setShared(false);
    }
  };

  return (
    <div className="sidebarPanel">
      <div className="sidebarPanel__roomCard">
        <div className="sidebarPanel__roomRow">
          <Hash size={15} aria-hidden="true" />
          <span className="sidebarPanel__roomLabel">Room</span>
        </div>
        <div className="sidebarPanel__roomId">{roomId}</div>
        <button type="button" className="sidebarPanel__shareBtn" onClick={handleShare}>
          <Share2 size={14} aria-hidden="true" />
          {shared ? 'Link Copied' : 'Share'}
        </button>
      </div>

      <UserList users={users} currentUser={currentUser} />
    </div>
  );
};

export default Sidebar;