import { useState } from "react";
import { View, Text, Image, Pressable, ScrollView, TextInput, FlatList, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Song, songDetails } from "../data/songs";
import { MusicUser, USERS, initials } from "../data/users";
import { Seeder, TOP_SEEDERS, formatSeeds } from "../data/seeders";
import { usePlayback } from "../playback/PlaybackContext";
import { COLORS } from "../theme";
import { PauseIcon, PlayIcon, SearchIcon } from "../components/Icons";
import NowPlayingBar from "../components/NowPlayingBar";

type Props = {
    onOpenUser: (user: MusicUser) => void;
    onOpenPlayer: () => void;
};

const Home = ({ onOpenUser, onOpenPlayer }: Props) => {
    const insets = useSafeAreaInsets();
    const { currentSong, isPlaying, recentlyPlayed, start, togglePlay } = usePlayback();
    const [query, setQuery] = useState("");

    // Replaying a recent song queues the recent list, so next/previous move through it.
    const openRecent = (song: Song) => {
        if (song.id !== currentSong?.id) {
            start(song, recentlyPlayed);
        }
        onOpenPlayer();
    };

    const playRecent = (song: Song) => {
        if (song.id === currentSong?.id) {
            togglePlay();
        } else {
            start(song, recentlyPlayed);
        }
    };

    const search = query.trim().toLowerCase();
    const users = search ? USERS.filter(user => user.name.toLowerCase().includes(search)) : USERS;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingTop: insets.top + 16,
                    // leave room for the now-playing bar
                    paddingBottom: insets.bottom + (currentSong ? 110 : 24),
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Search */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: 52,
                        marginHorizontal: 20,
                        paddingHorizontal: 16,
                        borderRadius: 16,
                        backgroundColor: COLORS.surface,
                    }}
                >
                    <SearchIcon color={COLORS.textMuted} />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search listeners"
                        placeholderTextColor={COLORS.textMuted}
                        autoCorrect={false}
                        returnKeyType="search"
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            paddingVertical: 0,
                            color: COLORS.text,
                            fontSize: 15,
                        }}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery("")} hitSlop={10}>
                            <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>✕</Text>
                        </Pressable>
                    )}
                </View>

                {/* Top seeders */}
                <Text
                    style={{
                        color: COLORS.text,
                        fontSize: 18,
                        fontWeight: "700",
                        marginHorizontal: 20,
                        marginTop: 24,
                        marginBottom: 12,
                    }}
                >
                    Top seeders
                </Text>
                <FlatList
                    data={TOP_SEEDERS}
                    keyExtractor={seeder => seeder.id}
                    renderItem={({ item }) => <SeederItem seeder={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                />

                {/* Recently played */}
                <Text
                    style={{
                        color: COLORS.text,
                        fontSize: 18,
                        fontWeight: "700",
                        marginHorizontal: 20,
                        marginTop: 28,
                        marginBottom: 14,
                    }}
                >
                    Recently played
                </Text>
                {recentlyPlayed.length > 0 ? (
                    <View
                        style={{
                            marginHorizontal: 20,
                            padding: 8,
                            gap: 4,
                            borderRadius: 20,
                            backgroundColor: COLORS.surface,
                        }}
                    >
                        {recentlyPlayed.map(song => {
                            const playingThis = song.id === currentSong?.id && isPlaying;
                            return (
                                <Pressable
                                    key={song.id}
                                    onPress={() => openRecent(song)}
                                    style={{ flexDirection: "row", alignItems: "center", padding: 6 }}
                                >
                                    <Image
                                        source={{ uri: song.cover }}
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 12,
                                            backgroundColor: COLORS.surfaceRaised,
                                        }}
                                    />
                                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ color: COLORS.text, fontSize: 15, fontWeight: "600" }}
                                        >
                                            {song.title}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}
                                        >
                                            {songDetails(song)}
                                        </Text>
                                    </View>
                                    <Pressable
                                        onPress={() => playRecent(song)}
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
                        })}
                    </View>
                ) : (
                    <View
                        style={{
                            marginHorizontal: 20,
                            padding: 20,
                            borderRadius: 20,
                            backgroundColor: COLORS.surface,
                        }}
                    >
                        <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                            Nothing played yet. Pick a listener below to start.
                        </Text>
                    </View>
                )}

                {/* Listeners */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        marginHorizontal: 20,
                        marginTop: 28,
                        marginBottom: 14,
                    }}
                >
                    <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "700" }}>Listeners</Text>
                    <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
                        {users.filter(user => user.online).length} online
                    </Text>
                </View>
                {users.length === 0 ? (
                    <Text style={{ color: COLORS.textMuted, marginHorizontal: 20 }}>
                        {`No listeners match "${query.trim()}"`}
                    </Text>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                    >
                        {users.map(user => (
                            <UserCard key={user.id} user={user} onPress={() => onOpenUser(user)} />
                        ))}
                    </ScrollView>
                )}
            </ScrollView>
            <NowPlayingBar onPress={onOpenPlayer} />
        </View>
    );
};

const UserCard = ({ user, onPress }: { user: MusicUser; onPress: () => void }) => {
    const { width } = useWindowDimensions();
    // Wide enough to feel like a card, narrow enough that the next one peeks in.
    const cardWidth = Math.min(width * 0.8, 340);

    return (
        <Pressable
            onPress={onPress}
            style={{
                width: cardWidth,
                height: 180,
                padding: 18,
                borderRadius: 28,
                backgroundColor: user.color,
                overflow: "hidden",
                justifyContent: "space-between",
            }}
        >
            {/* Decoration in the corner, like the illustration in the design */}
            <Text
                style={{
                    position: "absolute",
                    right: 8,
                    bottom: -30,
                    fontSize: 130,
                    color: "rgba(0,0,0,0.1)",
                }}
            >
                ♫
            </Text>

            {/* Avatar + status | taste points */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                        style={{
                            width: 46,
                            height: 46,
                            borderRadius: 23,
                            backgroundColor: COLORS.onAccent,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ color: user.color, fontSize: 16, fontWeight: "800" }}>
                            {initials(user.name)}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 8,
                            paddingHorizontal: 9,
                            paddingVertical: 5,
                            borderRadius: 12,
                            backgroundColor: "rgba(0,0,0,0.12)",
                        }}
                    >
                        <View
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: 4,
                                backgroundColor: user.online ? COLORS.online : COLORS.offline,
                            }}
                        />
                        <Text
                            style={{
                                color: COLORS.onAccent,
                                fontSize: 11,
                                fontWeight: "700",
                                marginLeft: 5,
                            }}
                        >
                            {user.online ? "Online" : "Offline"}
                        </Text>
                    </View>
                </View>
                {/* Wraps onto two lines instead of overflowing on narrow phones */}
                <Text
                    style={{
                        flexShrink: 1,
                        marginLeft: 10,
                        textAlign: "right",
                        color: COLORS.onAccent,
                        fontSize: 15,
                        fontWeight: "800",
                    }}
                >
                    {user.tastePoints} taste points
                </Text>
            </View>

            {/* Name + rating */}
            <View>
                <Text numberOfLines={1} style={{ color: COLORS.onAccent, fontSize: 28, fontWeight: "800" }}>
                    {user.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                    <Text style={{ fontSize: 15, letterSpacing: 1 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Text
                                key={star}
                                style={{
                                    color: star <= Math.round(user.rating) ? COLORS.onAccent : "rgba(0,0,0,0.2)",
                                }}
                            >
                                ★
                            </Text>
                        ))}
                    </Text>
                    <Text
                        style={{
                            color: COLORS.onAccent,
                            fontSize: 13,
                            fontWeight: "600",
                            marginLeft: 8,
                        }}
                    >
                        {user.rating.toFixed(1)} rating
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

// Circle photo with a fire + seed count badge on its top edge, name underneath.
const SeederItem = ({ seeder }: { seeder: Seeder }) => (
    <View style={{ width: 76, alignItems: "center" }}>
        {/* paddingTop leaves room for the badge, which overlaps the top of the circle */}
        <View style={{ paddingTop: 12 }}>
            <View
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    borderWidth: 2,
                    borderColor: COLORS.accent,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Image
                    source={{ uri: seeder.photo }}
                    style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: COLORS.surfaceRaised }}
                />
            </View>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: COLORS.background,
                        backgroundColor: COLORS.surfaceRaised,
                    }}
                >
                    <Text style={{ fontSize: 11 }}>🔥</Text>
                    <Text style={{ color: COLORS.text, fontSize: 11, fontWeight: "700", marginLeft: 2 }}>
                        {formatSeeds(seeder.seeds)}
                    </Text>
                </View>
            </View>
        </View>
        <Text
            numberOfLines={1}
            style={{ color: COLORS.textSoft, fontSize: 12, marginTop: 8, textAlign: "center", width: 76 }}
        >
            {seeder.name}
        </Text>
    </View>
);

export default Home;
