import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  users: string[];
  currentUser: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

const UserList: React.FC<Props> = ({ users, currentUser }) => {
  const allUsers = Array.from(new Set([currentUser, ...users]));

  return (
    <aside className="userList">
      <div className="userList__titleRow">
        <Users size={15} className="userList__titleIcon" aria-hidden="true" />
        <span className="userList__title">Active Users</span>
      </div>

      <ul className="userList__items">
        {allUsers.map((user) => {
          const isSelf = user === currentUser;

          return (
            <li key={user} className={isSelf ? 'userList__item userList__item--self' : 'userList__item'}>
              <span className="userList__avatar" aria-hidden="true">
                {getInitials(user)}
              </span>
              <span className="userList__name">{isSelf ? `${user} (you)` : user}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default UserList;