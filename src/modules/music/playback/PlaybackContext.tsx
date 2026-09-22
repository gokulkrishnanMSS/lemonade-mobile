import { createContext, ReactNode, useContext, useState } from "react";
import Video from "react-native-video";
import { Song, songUrl } from "../data/songs";

const RECENT_LIMIT = 3;

type Playback = {
    currentSong: Song | null;
    isPlaying: boolean;
    shuffle: boolean;
    repeat: boolean;
    position: number;
    duration: number;
    likedIds: Set<string>;
    recentlyPlayed: Song[]; // newest first, includes the current song
    start: (song: Song, queue: Song[]) => void;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    toggleLike: (id: string) => void;
};

const PlaybackContext = createContext<Playback | null>(null);

export const usePlayback = () => {
    const playback = useContext(PlaybackContext);
    if (!playback) {
        throw new Error("usePlayback must be used inside PlaybackProvider");
    }
    return playback;
};

// Owns the audio player and what's playing, so the home, playlist and player pages all share it.
export const PlaybackProvider = ({ children }: { children: ReactNode }) => {
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

    const start = (song: Song, newQueue: Song[]) => {
        setQueue(newQueue);
        setCurrentSong(song);
        setPosition(0);
        setDuration(0);
        setIsPlaying(true);
        setRecentlyPlayed(prev => [song, ...prev.filter(s => s.id !== song.id)].slice(0, RECENT_LIMIT));
    };

    const togglePlay = () => {
        if (currentSong) {
            setIsPlaying(playing => !playing);
        }
    };

    const skip = (step: 1 | -1) => {
        if (!currentSong || queue.length === 0) {
            return;
        }
        const currentIndex = queue.findIndex(song => song.id === currentSong.id);
        let nextIndex = (currentIndex + step + queue.length) % queue.length;
        if (shuffle && queue.length > 1) {
            do {
                nextIndex = Math.floor(Math.random() * queue.length);
            } while (nextIndex === currentIndex);
        }
        start(queue[nextIndex], queue);
    };

    const toggleLike = (id: string) => {
        setLikedIds(prev => {
            const liked = new Set(prev);
            if (liked.has(id)) {
                liked.delete(id);
            } else {
                liked.add(id);
            }
            return liked;
        });
    };

    const value: Playback = {
        currentSong,
        isPlaying,
        shuffle,
        repeat,
        position,
        duration,
        likedIds,
        recentlyPlayed,
        start,
        togglePlay,
        next: () => skip(1),
        prev: () => skip(-1),
        toggleShuffle: () => setShuffle(on => !on),
        toggleRepeat: () => setRepeat(on => !on),
        toggleLike,
    };

    return (
        <PlaybackContext.Provider value={value}>
            {children}
            {/* Audio only: the player has no size and stays mounted on every screen so playback continues. */}
            {currentSong && (
                <Video
                    key={currentSong.id}
                    source={{ uri: songUrl(currentSong.id) }}
                    paused={!isPlaying}
                    repeat={repeat}
                    onLoad={data => setDuration(data.duration)}
                    onProgress={data => setPosition(data.currentTime)}
                    onEnd={() => skip(1)}
                    onError={e => {
                        console.log("Playback error:", JSON.stringify(e.error));
                        setIsPlaying(false);
                    }}
                    style={{ width: 0, height: 0 }}
                />
            )}
        </PlaybackContext.Provider>
    );
};
