import React, { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';

interface Props {
  roomId: string;
  filePath: string;
}

const Breadcrumbs: React.FC<Props> = ({ roomId, filePath }) => {
  const [copied, setCopied] = useState(false);
  const segments = useMemo(() => filePath.split('/').filter(Boolean), [filePath]);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <header className="breadcrumbs" aria-label="Editor context">
      <nav className="breadcrumbs__path" aria-label="File path">
        {segments.map((segment, index) => (
          <React.Fragment key={`${segment}-${index}`}>
            <button type="button" className="breadcrumbs__segment">
              {segment}
            </button>
            {index < segments.length - 1 ? <span className="breadcrumbs__separator">&gt;</span> : null}
          </React.Fragment>
        ))}
      </nav>

      <button
        type="button"
        className="breadcrumbs__copyBtn"
        onClick={handleCopyRoomId}
        aria-label="Copy room ID"
      >
        <Copy size={14} aria-hidden="true" />
        {copied ? 'Copied' : 'Copy Room ID'}
      </button>
    </header>
  );
};

export default Breadcrumbs;