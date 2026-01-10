import React, { useState, useEffect, useRef } from 'react';
import { videoService } from '../services/videoService';
import { Room, RemoteParticipant, RemoteTrack, RemoteVideoTrack, RemoteAudioTrack, LocalVideoTrack } from 'twilio-video';

interface VideoConferenceProps {
    roomName: string;
    userName: string;
    token: string; // Real implementation requires fetching this from backend
    onLeave: () => void;
}

const VideoConference: React.FC<VideoConferenceProps> = ({ roomName, userName, token, onLeave }) => {
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const localVideoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const startCall = async () => {
            try {
                const connectedRoom = await videoService.joinCall({ roomName, token });
                setRoom(connectedRoom);

                // Attach local video
                const localTrack = Array.from(connectedRoom.localParticipant.videoTracks.values())[0]?.track as LocalVideoTrack;
                if (localTrack && localVideoRef.current) {
                    const el = localTrack.attach();
                    el.className = "w-full h-full object-cover";
                    localVideoRef.current.appendChild(el);
                }

                // Handle existing participants
                setParticipants(Array.from(connectedRoom.participants.values()));

                // Listen for new participants
                connectedRoom.on('participantConnected', p => setParticipants(prev => [...prev, p]));
                connectedRoom.on('participantDisconnected', p => setParticipants(prev => prev.filter(item => item.sid !== p.sid)));

            } catch (err) {
                console.error("Twilio Join Error:", err);
                alert("Failed to connect to Twilio Video Room. Token might be invalid.");
            }
        };

        startCall();

        return () => {
            videoService.leaveCall();
        };
    }, [roomName, token]);

    const toggleAudio = () => {
        const newState = !isAudioEnabled;
        videoService.toggleAudio(newState);
        setIsAudioEnabled(newState);
    };

    const toggleVideo = () => {
        const newState = !isVideoEnabled;
        videoService.toggleVideo(newState);
        setIsVideoEnabled(newState);
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 flex items-center justify-between border-b border-white/5">
                <div>
                    <h2 className="text-white font-black text-xl tracking-tight">{roomName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{participants.length + 1} LIVE NOW</p>
                    </div>
                </div>
                <button
                    onClick={onLeave}
                    className="px-8 py-3 bg-red-600/20 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl"
                >
                    End Session
                </button>
            </div>

            {/* Video Grid */}
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
                {/* Local Participant */}
                <div className="relative bg-slate-950 rounded-[2.5rem] overflow-hidden aspect-video border border-white/5 shadow-2xl group">
                    <div ref={localVideoRef} className="w-full h-full"></div>
                    {!isVideoEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                                {userName[0]}
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
                        <p className="text-white text-xs font-black uppercase tracking-widest">{userName} (You)</p>
                    </div>
                </div>

                {/* Remote Participants */}
                {participants.map((p) => (
                    <ParticipantView key={p.sid} participant={p} />
                ))}
            </div>

            {/* Control Bar */}
            <div className="p-8 bg-slate-900 border-t border-white/5 flex items-center justify-center gap-6">
                <button
                    onClick={toggleAudio}
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-2xl ${isAudioEnabled ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-600 text-white animate-pulse'
                        }`}
                >
                    {isAudioEnabled ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    )}
                </button>

                <button
                    onClick={toggleVideo}
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-2xl ${isVideoEnabled ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-600 text-white animate-pulse'
                        }`}
                >
                    {isVideoEnabled ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

// Remote Participant Sub-component
const ParticipantView: React.FC<{ participant: RemoteParticipant }> = ({ participant }) => {
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleTrack = (track: RemoteTrack) => {
            if (track.kind === 'video') {
                const el = (track as RemoteVideoTrack).attach();
                el.className = "w-full h-full object-cover";
                videoRef.current?.appendChild(el);
            } else if (track.kind === 'audio') {
                (track as RemoteAudioTrack).attach();
            }
        };

        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track) handleTrack(publication.track);
        });

        participant.on('trackSubscribed', handleTrack);

        return () => {
            participant.removeAllListeners();
        };
    }, [participant]);

    return (
        <div className="relative bg-slate-950 rounded-[2.5rem] overflow-hidden aspect-video border border-white/5 shadow-2xl">
            <div ref={videoRef} className="w-full h-full"></div>
            <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
                <p className="text-white text-xs font-black uppercase tracking-widest">{participant.identity}</p>
            </div>
        </div>
    );
};

export default VideoConference;
