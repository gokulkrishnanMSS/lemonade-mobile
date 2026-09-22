import { useCallback, useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Song, fetchSongs, songDetails } from "../data/songs";
import { MusicUser } from "../data/users";
import { usePlayback } from "../playback/PlaybackContext";
import { COLORS } from "../theme";
import { MoreIcon, PauseIcon, PlayIcon } from "../components/Icons";

const FILTERS = [
    { key: "all", label: "All" },
    { key: "playlists", label: "Playlists" },
    { key: "liked", label: "Liked Songs" },
    { key: "downloads", label: "Downloads" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

type Props = {
    user: MusicUser;
    onBack: () => void;
    onOpenPlayer: () => void;
};

const Playlist = ({ user, onBack, onOpenPlayer }: Props) => {
    const insets = useSafeAreaInsets();
    const { currentSong, isPlaying, shuffle, likedIds, start, togglePlay, toggleShuffle } = usePlayback();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterKey>("all");

    // The backend only has one connected Drive, so every listener shows the same songs for now.
    const loadSongs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setSongs(await fetchSongs());
        } catch (e) {
            const detail = axios.isAxiosError(e) ? e.response?.status ?? e.message : String(e);
            console.log("Failed to load songs:", detail, axios.isAxiosError(e) ? e.response?.data : "");
            setError(`Couldn't load songs (${detail})`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSongs();
    }, [loadSongs]);

    const visibleSongs = songs.filter(song => {
        if (filter === "liked") return likedIds.has(song.id);
        if (filter === "downloads") return song.downloaded;
        return true;
    });

    const openSong = (song: Song) => {
        if (song.id !== currentSong?.id) {
            start(song, visibleSongs);
        } else if (!isPlaying) {
            togglePlay();
        }
        onOpenPlayer();
    };

    const playSong = (song: Song) => {
        if (song.id === currentSong?.id) {
            togglePlay();
        } else {
            start(song, visibleSongs);
        }
    };

    const playFromMiniPlayer = () => {
        if (currentSong) {
            togglePlay();
        } else if (visibleSongs.length > 0) {
            start(visibleSongs[0], visibleSongs);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
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
                <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        marginHorizontal: 12,
                        textAlign: "center",
                        color: COLORS.text,
                        fontSize: 18,
                        fontWeight: "600",
                    }}
                >
                    {user.name}
                </Text>
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

            {/* Filter chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0, marginTop: 8, marginBottom: 16 }}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
                {FILTERS.map(item => {
                    const selected = item.key === filter;
                    return (
                        <Pressable
                            key={item.key}
                            onPress={() => setFilter(item.key)}
                            style={{
                                paddingHorizontal: 18,
                                paddingVertical: 10,
                                borderRadius: 22,
                                backgroundColor: selected ? COLORS.accent : COLORS.surface,
                            }}
                        >
                            <Text
                                style={{
                                    color: selected ? COLORS.onAccent : COLORS.textSoft,
                                    fontSize: 14,
                                    // Not "500": on some Android phones it falls back to a font that clips descenders
                                    fontWeight: selected ? "600" : "400",
                                }}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Song list */}
            <FlatList
                data={visibleSongs}
                keyExtractor={song => song.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 110, gap: 16 }}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
                    ) : error ? (
                        <View style={{ alignItems: "center", marginTop: 40 }}>
                            <Text style={{ color: COLORS.textMuted, textAlign: "center" }}>{error}</Text>
                            <Pressable
                                onPress={loadSongs}
                                style={{
                                    marginTop: 16,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 22,
                                    backgroundColor: COLORS.accent,
                                }}
                            >
                                <Text style={{ color: COLORS.onAccent, fontWeight: "600" }}>Retry</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <Text style={{ color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>
                            Nothing here yet
                        </Text>
                    )
                }
                renderItem={({ item }) => {
                    const playingThis = item.id === currentSong?.id && isPlaying;
                    return (
                        <Pressable
                            onPress={() => openSong(item)}
                            style={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <Image
                                source={{ uri: item.cover }}
                                style={{ width: 58, height: 58, borderRadius: 14, backgroundColor: COLORS.surface }}
                            />
                            <View style={{ flex: 1, marginLeft: 14, marginRight: 12 }}>
                                <Text numberOfLines={1} style={{ color: COLORS.text, fontSize: 16, fontWeight: "600" }}>
                                    {item.title}
                                </Text>
                                <Text numberOfLines={1} style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 5 }}>
                                    {songDetails(item)}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => playSong(item)}
                                hitSlop={8}
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 19,
                                    backgroundColor: playingThis ? COLORS.accent : COLORS.surfaceRaised,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {playingThis ? (
                                    <PauseIcon size={12} color={COLORS.onAccent} />
                                ) : (
                                    <PlayIcon size={12} />
                                )}
                            </Pressable>
                        </Pressable>
                    );
                }}
            />

            {/* Mini player */}
            <View
                style={{
                    position: "absolute",
                    bottom: insets.bottom + 20,
                    alignSelf: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.surfaceRaised,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 30,
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                }}
            >
                <Pressable
                    onPress={playFromMiniPlayer}
                    style={{ width: 52, height: 48, alignItems: "center", justifyContent: "center" }}
                >
                    {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                </Pressable>
                <View style={{ width: 1, height: 22, backgroundColor: COLORS.border }} />
                <Pressable
                    onPress={toggleShuffle}
                    style={{ width: 52, height: 48, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={{ color: shuffle ? COLORS.accent : COLORS.text, fontSize: 20 }}>⇄</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Playlist;
