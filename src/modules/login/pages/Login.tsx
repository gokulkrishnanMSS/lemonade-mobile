import { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from "@react-native-google-signin/google-signin";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

// "localhost" is the phone itself; run `adb reverse tcp:8080 tcp:8080` so it reaches your machine.
const API_BASE_URL = "http://localhost:8080";

const loginToBackend = async (serverAuthCode: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, serverAuthCode, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
        // Send the raw code like the curl does; axios would otherwise JSON-quote the string.
        transformRequest: [(data) => data],
    });
    return res.data;
};

const Login = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "604387859335-2gffss6cn0eqnselrdqbajg5u8ccck67.apps.googleusercontent.com",
        
        // 2. Required so Google returns a serverAuthCode for your backend
        offlineAccess: true,

        // 3. Force consent prompt to guarantee a refresh token is returned
        forceCodeForRefreshToken: true,
            scopes: [DRIVE_SCOPE],
        });
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            if (!isSuccessResponse(response)) {
                console.log("Sign in cancelled");
                return;
            }

            const { serverAuthCode } = response.data;
            console.log("Server auth code:", serverAuthCode);
            if (!serverAuthCode) {
                console.log("No serverAuthCode returned; check webClientId and offlineAccess");
                return;
            }

            const loginResponse = await loginToBackend(serverAuthCode);
            console.log("Backend login response:", loginResponse);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Backend login error:", error.response?.status ?? error.code, error.response?.data ?? error.message);
            } else if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        console.log("Sign in already in progress");
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.log("Play services not available or outdated");
                        break;
                    default:
                        console.log("Google sign in error:", error.code, error.message);
                }
            } else {
                console.log("Google sign in error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                )}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#4285F4",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 200,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Login;
