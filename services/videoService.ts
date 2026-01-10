import Video, { Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';

export interface VideoCallConfig {
    roomName: string;
    token: string; // Tokens should be generated via a backend/Edge function
}

class VideoService {
    private room: Room | null = null;
    private localVideoTrack: LocalVideoTrack | null = null;
    private localAudioTrack: LocalAudioTrack | null = null;

    async joinCall(config: VideoCallConfig): Promise<Room> {
        try {
            // Connect to the Twilio Room
            this.room = await Video.connect(config.token, {
                name: config.roomName,
                audio: true,
                video: { width: 640 }
            });

            // Capture local tracks for easier reference in UI
            this.localAudioTrack = Array.from(this.room.localParticipant.audioTracks.values())[0]?.track as LocalAudioTrack;
            this.localVideoTrack = Array.from(this.room.localParticipant.videoTracks.values())[0]?.track as LocalVideoTrack;

            return this.room;
        } catch (error) {
            console.error('Twilio Video Connection Error:', error);
            throw error;
        }
    }

    async leaveCall(): Promise<void> {
        if (this.room) {
            this.room.disconnect();
            this.room = null;
        }
        this.localVideoTrack = null;
        this.localAudioTrack = null;
    }

    toggleAudio(enabled: boolean): void {
        if (this.localAudioTrack) {
            if (enabled) this.localAudioTrack.enable();
            else this.localAudioTrack.disable();
        }
    }

    toggleVideo(enabled: boolean): void {
        if (this.localVideoTrack) {
            if (enabled) this.localVideoTrack.enable();
            else this.localVideoTrack.disable();
        }
    }

    // Helper to handle participant events
    onParticipantConnected(room: Room, callback: (participant: RemoteParticipant) => void) {
        room.on('participantConnected', callback);
    }

    onParticipantDisconnected(room: Room, callback: (participant: RemoteParticipant) => void) {
        room.on('participantDisconnected', callback);
    }
}

export const videoService = new VideoService();
