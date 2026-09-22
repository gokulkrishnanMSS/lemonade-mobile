import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { songDetails } from "../data/songs";
import { usePlayback } from "../playback/PlaybackContext";
import { COLORS } from "../theme";
import { PauseIcon, PlayIcon, SkipIcon } from "./Icons";

// Bar pinned to the bottom of the screen showing the current song; tapping it opens the player.
// Renders nothing until a song has been started.
const NowPlayingBar = ({ onPress }: { onPress: () => void }) => {
    const insets = useSafeAreaInsets();
    const { currentSong, isPlaying, position, duration, togglePlay, next } = usePlayback();

    if (!currentSong) {
        return null;
    }

    const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
    const loadingSong = isPlaying && duration === 0;

    return (
        <Pressable
            onPress={onPress}
            style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: insets.bottom + 12,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.surfaceRaised,
                overflow: "hidden",
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                <Image
                    source={{ uri: currentSong.cover }}
                    style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surface }}
                />
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text numberOfLines={1} style={{ color: COLORS.text, fontSize: 15, fontWeight: "600" }}>
                        {currentSong.title}
                    </Text>
                    <Text numberOfLines={1} style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 3 }}>
                        {songDetails(currentSong)}
                    </Text>
                </View>
                <Pressable
                    onPress={togglePlay}
                    hitSlop={6}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: COLORS.accent,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {loadingSong ? (
                        <ActivityIndicator size="small" color={COLORS.onAccent} />
                    ) : isPlaying ? (
                        <PauseIcon size={13} color={COLORS.onAccent} />
                    ) : (
                        <PlayIcon size={13} color={COLORS.onAccent} />
                    )}
                </Pressable>
                <Pressable
                    onPress={next}
                    hitSlop={6}
                    style={{ width: 42, height: 42, marginLeft: 4, alignItems: "center", justifyContent: "center" }}
                >
                    <SkipIcon direction="next" size={15} />
                </Pressable>
            </View>

            {/* Progress along the bottom edge */}
            <View style={{ height: 3, backgroundColor: COLORS.border }}>
                <View style={{ width: `${progress * 100}%`, height: 3, backgroundColor: COLORS.accent }} />
            </View>
        </Pressable>
    );
};

export default NowPlayingBar;
