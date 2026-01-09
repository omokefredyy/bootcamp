import React, { useState, useEffect, useRef } from 'react';
import { videoService } from '../services/videoService';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

interface VideoConferenceProps {
    channelName: string;
    userName: string;
    onLeave: () => void;
}

const VideoConference: React.FC<VideoConferenceProps> = ({ channelName, userName, onLeave }) => {
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const localVideoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const joinCall = async () => {
            try {
                const { localVideoTrack } = await videoService.joinCall({ channelName });

                // Play local video
                if (localVideoRef.current) {
                    localVideoTrack.play(localVideoRef.current);
                }

                // Subscribe to remote users
                videoService.subscribeToRemoteUsers(
                    (user) => {
                        setRemoteUsers(prev => [...prev, user]);
                    },
                    (user) => {
                        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
                    }
                );

                setIsJoined(true);
            } catch (error) {
                console.error('Failed to join call:', error);
                alert('Failed to join video call. Please check your Agora configuration.');
            }
        };

        joinCall();

        return () => {
            videoService.leaveCall();
        };
    }, [channelName]);

    const toggleAudio = async () => {
        const newState = !isAudioEnabled;
        await videoService.toggleAudio(newState);
        setIsAudioEnabled(newState);
    };

    const toggleVideo = async () => {
        const newState = !isVideoEnabled;
        await videoService.toggleVideo(newState);
        setIsVideoEnabled(newState);
    };

    const handleLeave = async () => {
        await videoService.leaveCall();
        onLeave();
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-slate-800 p-4 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-bold text-lg">{channelName}</h2>
                    <p className="text-slate-400 text-sm">{remoteUsers.length + 1} participant{remoteUsers.length !== 0 ? 's' : ''}</p>
                </div>
                <button
                    onClick={handleLeave}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                    Leave Call
                </button>
            </div>

            {/* Video Grid */}
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
                {/* Local Video */}
                <div className="relative bg-slate-800 rounded-2xl overflow-hidden aspect-video">
                    <div ref={localVideoRef} className="w-full h-full"></div>
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                        <p className="text-white text-sm font-bold">{userName} (You)</p>
                    </div>
                </div>

                {/* Remote Videos */}
                {remoteUsers.map((user) => (
                    <RemoteVideo key={user.uid} user={user} />
                ))}
            </div>

            {/* Controls */}
            <div className="bg-slate-800 p-6 flex items-center justify-center gap-4">
                <button
                    onClick={toggleAudio}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isAudioEnabled ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
                        }`}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isAudioEnabled ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        )}
                    </svg>
                </button>

                <button
                    onClick={toggleVideo}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoEnabled ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
                        }`}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isVideoEnabled ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        )}
                    </svg>
                </button>
            </div>
        </div>
    );
};

// Remote Video Component
const RemoteVideo: React.FC<{ user: IAgoraRTCRemoteUser }> = ({ user }) => {
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user.videoTrack && videoRef.current) {
            user.videoTrack.play(videoRef.current);
        }
    }, [user.videoTrack]);

    return (
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden aspect-video">
            <div ref={videoRef} className="w-full h-full"></div>
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                <p className="text-white text-sm font-bold">User {user.uid}</p>
            </div>
        </div>
    );
};

export default VideoConference;
