import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking?: boolean;
  isHandRaised?: boolean;
}

interface LiveSessionProps {
  sessionId: string;
  hostId: string;
  participants: Participant[];
  onEndSession?: () => void;
  onToggleMute?: (participantId: string) => void;
  onToggleVideo?: (participantId: string) => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({
  sessionId,
  hostId,
  participants,
  onEndSession,
  onToggleMute,
  onToggleVideo
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main video grid */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {participants.map(participant => (
          <Card key={participant.id} className="relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              {/* Video placeholder */}
              <div className="text-gray-400">Video Feed</div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center space-x-2">
              <Avatar
                src={participant.avatar}
                alt={participant.name}
                size="sm"
              />
              <span className="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {participant.name}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white border-t p-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleMuteToggle}
            variant={isMuted ? 'secondary' : 'primary'}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
          <Button
            onClick={handleVideoToggle}
            variant={isVideoOn ? 'primary' : 'secondary'}
          >
            {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
          </Button>
          <Button
            onClick={handleScreenShare}
            variant={isScreenSharing ? 'primary' : 'secondary'}
          >
            {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </Button>
          <Button onClick={onEndSession} variant="secondary" className="bg-red-500 hover:bg-red-600 text-white">
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
