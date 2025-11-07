import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  Users,
  MessageCircle,
  MoreVertical,
  Maximize,
  Minimize
} from 'lucide-react';

interface VideoCallProps {
  advisorName: string;
  advisorAvatar: string;
  isOpen: boolean;
  onClose: () => void;
  callType: 'video' | 'audio';
}

export const VideoCall: React.FC<VideoCallProps> = ({
  advisorName,
  advisorAvatar,
  isOpen,
  onClose,
  callType
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Simulate connection
      const timer = setTimeout(() => {
        setCallStatus('connected');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-gray-900 z-50 flex flex-col ${
        isFullscreen ? '' : 'rounded-2xl m-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={advisorAvatar}
            alt={advisorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium">{advisorName}</h3>
            <p className="text-sm opacity-80">
              {callStatus === 'connecting' && 'Bağlanıyor...'}
              {callStatus === 'connected' && formatDuration(callDuration)}
              {callStatus === 'ended' && 'Arama sona erdi'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {callStatus === 'connecting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-medium mb-2">Bağlanıyor...</h3>
              <p className="text-white/80">{advisorName} ile görüşme başlatılıyor</p>
            </div>
          </div>
        )}

        {callStatus === 'connected' && (
          <>
            {/* Remote Video */}
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              {isVideoEnabled ? (
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="text-center text-white">
                  <img
                    src={advisorAvatar}
                    alt={advisorName}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-medium">{advisorName}</h3>
                  <p className="text-white/80">Video kapalı</p>
                </div>
              )}
            </div>

            {/* Local Video */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
              {isVideoEnabled ? (
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <VideoOff className="w-8 h-8" />
                </div>
              )}
            </div>
          </>
        )}

        {callStatus === 'ended' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneOff className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Arama Sona Erdi</h3>
              <p className="text-white/80">Toplam süre: {formatDuration(callDuration)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {callStatus === 'connected' && (
        <div className="p-6 bg-black/20">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-4 rounded-full transition-colors ${
                isAudioEnabled 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-4 rounded-full transition-colors ${
                isVideoEnabled 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            <button className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>

            <button className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};