import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../music/theme";

type Props = {
    onLoginSuccess: (username: string) => void;
};

const Login = ({ onLoginSuccess }: Props) => {
    const insets = useSafeAreaInsets();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        const name = username.trim();
        if (!name || !password) {
            setError("Enter your username and password");
            return;
        }
        setError(null);
        // The backend has no username/password endpoint yet, so any filled-in credentials are accepted.
        // Call the real login API here (and show its error) once it exists.
        onLoginSuccess(name);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    paddingHorizontal: 24,
                    paddingTop: insets.top + 24,
                    paddingBottom: insets.bottom + 24,
                }}
            >
                <Text style={{ color: COLORS.text, fontSize: 32, fontWeight: "800" }}>Welcome back</Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15, marginTop: 8 }}>Log in to keep listening</Text>

                {/* Username */}
                <Text style={{ color: COLORS.textSoft, fontSize: 13, fontWeight: "600", marginTop: 36, marginBottom: 8 }}>
                    Username
                </Text>
                <TextInput
                    value={username}
                    onChangeText={text => {
                        setUsername(text);
                        setError(null);
                    }}
                    placeholder="Enter your username"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    textContentType="username"
                    returnKeyType="next"
                    style={{
                        height: 54,
                        paddingHorizontal: 16,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.surface,
                        color: COLORS.text,
                        fontSize: 15,
                    }}
                />

                {/* Password */}
                <Text style={{ color: COLORS.textSoft, fontSize: 13, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>
                    Password
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: 54,
                        paddingLeft: 16,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.surface,
                    }}
                >
                    <TextInput
                        value={password}
                        onChangeText={text => {
                            setPassword(text);
                            setError(null);
                        }}
                        placeholder="Enter your password"
                        placeholderTextColor={COLORS.textMuted}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="go"
                        onSubmitEditing={handleLogin}
                        style={{ flex: 1, height: 54, color: COLORS.text, fontSize: 15 }}
                    />
                    <Pressable
                        onPress={() => setShowPassword(show => !show)}
                        hitSlop={8}
                        style={{ paddingHorizontal: 16, height: 54, justifyContent: "center" }}
                    >
                        <Text style={{ color: COLORS.accent, fontSize: 13, fontWeight: "600" }}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </Pressable>
                </View>

                {error && <Text style={{ color: "#F87171", fontSize: 13, marginTop: 14 }}>{error}</Text>}

                <Pressable
                    onPress={handleLogin}
                    style={{
                        height: 54,
                        marginTop: 28,
                        borderRadius: 27,
                        backgroundColor: COLORS.accent,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: COLORS.onAccent, fontSize: 16, fontWeight: "700" }}>Log in</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
