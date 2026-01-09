import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

// Agora configuration
const APP_ID = import.meta.env.VITE_AGORA_APP_ID || '';

export interface VideoCallConfig {
    channelName: string;
    token?: string;
    uid?: string | number;
}

class VideoService {
    private client: IAgoraRTCClient | null = null;
    private localAudioTrack: IMicrophoneAudioTrack | null = null;
    private localVideoTrack: ICameraVideoTrack | null = null;

    async joinCall(config: VideoCallConfig): Promise<{
        client: IAgoraRTCClient;
        localAudioTrack: IMicrophoneAudioTrack;
        localVideoTrack: ICameraVideoTrack;
    }> {
        if (!APP_ID) {
            throw new Error('Agora App ID is not configured. Please add VITE_AGORA_APP_ID to your .env file.');
        }

        // Create Agora client
        this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        // Create local tracks
        [this.localAudioTrack, this.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

        // Join the channel
        await this.client.join(
            APP_ID,
            config.channelName,
            config.token || null,
            config.uid || null
        );

        // Publish local tracks
        await this.client.publish([this.localAudioTrack, this.localVideoTrack]);

        return {
            client: this.client,
            localAudioTrack: this.localAudioTrack,
            localVideoTrack: this.localVideoTrack,
        };
    }

    async leaveCall(): Promise<void> {
        // Close local tracks
        if (this.localAudioTrack) {
            this.localAudioTrack.close();
            this.localAudioTrack = null;
        }
        if (this.localVideoTrack) {
            this.localVideoTrack.close();
            this.localVideoTrack = null;
        }

        // Leave the channel
        if (this.client) {
            await this.client.leave();
            this.client = null;
        }
    }

    async toggleAudio(enabled: boolean): Promise<void> {
        if (this.localAudioTrack) {
            await this.localAudioTrack.setEnabled(enabled);
        }
    }

    async toggleVideo(enabled: boolean): Promise<void> {
        if (this.localVideoTrack) {
            await this.localVideoTrack.setEnabled(enabled);
        }
    }

    subscribeToRemoteUsers(
        onUserJoined: (user: IAgoraRTCRemoteUser) => void,
        onUserLeft: (user: IAgoraRTCRemoteUser) => void
    ): void {
        if (!this.client) return;

        this.client.on('user-published', async (user, mediaType) => {
            await this.client!.subscribe(user, mediaType);
            onUserJoined(user);
        });

        this.client.on('user-unpublished', (user) => {
            onUserLeft(user);
        });
    }
}

export const videoService = new VideoService();
