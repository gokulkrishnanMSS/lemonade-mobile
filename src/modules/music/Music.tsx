import { useEffect, useRef, useState } from "react";
import { BackHandler, StatusBar, View } from "react-native";
import { MusicUser } from "./data/users";
import { PlaybackProvider } from "./playback/PlaybackContext";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import Player from "./pages/Player";

type Route = { name: "home" } | { name: "playlist"; user: MusicUser } | { name: "player" };

type StackEntry = { key: number; route: Route };

// A small stack navigator: every screen in the stack stays mounted (so a playlist keeps its songs and
// scroll position when you come back to it), and only the top one is shown.
const Music = () => {
    const nextKey = useRef(1);
    const [stack, setStack] = useState<StackEntry[]>([{ key: 0, route: { name: "home" } }]);

    const push = (route: Route) => {
        const key = nextKey.current++;
        setStack(prev => [...prev, { key, route }]);
    };
    const pop = () => setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));

    // Android back button goes back one screen; on Home it leaves the app as usual.
    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            if (stack.length > 1) {
                setStack(prev => prev.slice(0, -1));
                return true;
            }
            return false;
        });
        return () => sub.remove();
    }, [stack.length]);

    const renderRoute = (route: Route) => {
        switch (route.name) {
            case "home":
                return (
                    <Home
                        onOpenUser={user => push({ name: "playlist", user })}
                        onOpenPlayer={() => push({ name: "player" })}
                    />
                );
            case "playlist":
                return <Playlist user={route.user} onBack={pop} onOpenPlayer={() => push({ name: "player" })} />;
            case "player":
                return <Player onBack={pop} />;
        }
    };

    return (
        <PlaybackProvider>
            <StatusBar barStyle="light-content" />
            {stack.map((entry, index) => (
                <View key={entry.key} style={{ flex: 1, display: index === stack.length - 1 ? "flex" : "none" }}>
                    {renderRoute(entry.route)}
                </View>
            ))}
        </PlaybackProvider>
    );
};

export default Music;
