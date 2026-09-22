import { View } from "react-native";

// Simple shapes drawn with Views, so no icon library or native rebuild is needed.

type IconProps = { size?: number; color?: string };

export const PlayIcon = ({ size = 14, color = "#fff" }: IconProps) => (
    <View
        style={{
            width: 0,
            height: 0,
            marginLeft: size * 0.15,
            borderTopWidth: size / 2,
            borderBottomWidth: size / 2,
            borderLeftWidth: size * 0.85,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: color,
        }}
    />
);

export const PauseIcon = ({ size = 14, color = "#fff" }: IconProps) => (
    <View style={{ flexDirection: "row", gap: size * 0.25 }}>
        <View style={{ width: size * 0.3, height: size, borderRadius: 2, backgroundColor: color }} />
        <View style={{ width: size * 0.3, height: size, borderRadius: 2, backgroundColor: color }} />
    </View>
);

export const SkipIcon = ({ size = 16, color = "#fff", direction }: IconProps & { direction: "next" | "prev" }) => {
    const triangle = (
        <View
            style={{
                width: 0,
                height: 0,
                borderTopWidth: size / 2,
                borderBottomWidth: size / 2,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                ...(direction === "next"
                    ? { borderLeftWidth: size * 0.8, borderLeftColor: color }
                    : { borderRightWidth: size * 0.8, borderRightColor: color }),
            }}
        />
    );
    const bar = <View style={{ width: size * 0.18, height: size, borderRadius: 1, backgroundColor: color }} />;

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {direction === "next" ? triangle : bar}
            {direction === "next" ? bar : triangle}
        </View>
    );
};

export const SearchIcon = ({ size = 18, color = "#fff" }: IconProps) => (
    <View style={{ width: size, height: size }}>
        <View
            style={{
                width: size * 0.72,
                height: size * 0.72,
                borderRadius: size,
                borderWidth: 2,
                borderColor: color,
            }}
        />
        <View
            style={{
                position: "absolute",
                left: size * 0.78,
                top: size * 0.58,
                width: 2,
                height: size * 0.4,
                borderRadius: 1,
                backgroundColor: color,
                transform: [{ rotate: "-45deg" }],
            }}
        />
    </View>
);

export const MoreIcon =({ color = "#fff" }: IconProps) => (
    <View style={{ flexDirection: "row", gap: 3 }}>
        {[0, 1, 2].map(i => (
            <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
        ))}
    </View>
);
