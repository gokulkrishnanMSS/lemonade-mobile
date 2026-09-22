import { View, Text, Image, Pressable, ActivityIndicator, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatTime, songDetails } from "../data/songs";
import { usePlayback } from "../playback/PlaybackContext";
import { COLORS } from "../theme";
import { MoreIcon, PauseIcon, PlayIcon, SkipIcon } from "../components/Icons";

type Props = {
    onBack: () => void;
};

const Player = ({ onBack }: Props) => {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const {
        currentSong: song,
        position,
        duration,
        isPlaying,
        shuffle,
        repeat,
        likedIds,
        togglePlay,
        next,
        prev,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
    } = usePlayback();

    if (!song) {
        return null;
    }

    const coverSize = Math.min(width - 48, height * 0.42);
    const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
    // The duration arrives once the file starts loading from the backend.
    const loadingSong = isPlaying && duration === 0;
    const liked = likedIds.has(song.id);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom + 24,
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                }}
            >
                <Pressable
                    onPress={onBack}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: COLORS.surface,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: COLORS.text, fontSize: 20 }}>←</Text>
                </Pressable>
                <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "600" }}>Now Playing</Text>
                <Pressable
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: COLORS.surface,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MoreIcon />
                </Pressable>
            </View>

            <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
                {/* Cover */}
                <Image
                    source={{ uri: song.cover }}
                    style={{
                        width: coverSize,
                        height: coverSize,
                        borderRadius: 28,
                        alignSelf: "center",
                        backgroundColor: COLORS.surface,
                    }}
                />

                {/* Title + like */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 32 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Text numberOfLines={2} style={{ color: COLORS.text, fontSize: 24, fontWeight: "700" }}>
                            {song.title}
                        </Text>
                        <Text numberOfLines={1} style={{ color: COLORS.textMuted, fontSize: 15, marginTop: 6 }}>
                            {songDetails(song)}
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => toggleLike(song.id)}
                        hitSlop={8}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: COLORS.surface,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* "\uFE0E" keeps the heart as a text glyph (not an emoji) so the color applies */}
                        <Text style={{ color: liked ? COLORS.accent : COLORS.textMuted, fontSize: 20 }}>
                            {liked ? "\u2665\uFE0E" : "\u2661"}
                        </Text>
                    </Pressable>
                </View>

                {/* Progress */}
                <View style={{ marginTop: 28, height: 14, justifyContent: "center" }}>
                    <View style={{ height: 4, borderRadius: 2, backgroundColor: COLORS.surfaceRaised }}>
                        <View
                            style={{
                                width: `${progress * 100}%`,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: COLORS.accent,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            left: `${progress * 100}%`,
                            marginLeft: -7,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            backgroundColor: COLORS.text,
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                    <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{formatTime(position)}</Text>
                    <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{duration > 0 ? formatTime(duration) : "--:--"}</Text>
                </View>

                {/* Controls */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 28,
                    }}
                >
                    <Pressable
                        onPress={toggleShuffle}
                        style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
                    >
                        <Text style={{ color: shuffle ? COLORS.accent : COLORS.textMuted, fontSize: 22 }}>⇄</Text>
                    </Pressable>
                    <Pressable
                        onPress={prev}
                        style={{ width: 56, height: 56, alignItems: "center", justifyContent: "center" }}
                    >
                        <SkipIcon direction="prev" size={20} />
                    </Pressable>
                    <Pressable
                        onPress={togglePlay}
                        style={{
                            width: 76,
                            height: 76,
                            borderRadius: 38,
                            backgroundColor: COLORS.accent,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {loadingSong ? (
                            <ActivityIndicator color={COLORS.onAccent} />
                        ) : isPlaying ? (
                            <PauseIcon size={24} color={COLORS.onAccent} />
                        ) : (
                            <PlayIcon size={24} color={COLORS.onAccent} />
                        )}
                    </Pressable>
                    <Pressable
                        onPress={next}
                        style={{ width: 56, height: 56, alignItems: "center", justifyContent: "center" }}
                    >
                        <SkipIcon direction="next" size={20} />
                    </Pressable>
                    <Pressable
                        onPress={toggleRepeat}
                        style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
                    >
                        <Text style={{ color: repeat ? COLORS.accent : COLORS.textMuted, fontSize: 22 }}>↻</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default Player;
