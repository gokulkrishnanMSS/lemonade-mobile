import axios from "axios";
import { API_BASE_URL } from "../../../config";

// Shape returned by GET /auth/files
type DriveFile = {
    id: string;
    name: string;
    mimeType: string;
    size: number | null;
    modifiedTime: string | null;
};

export type Song = {
    id: string;
    title: string;
    format: string;
    sizeBytes: number | null;
    cover: string;
    downloaded: boolean;
};

// GET /auth/files/{id} returns the audio file itself, so the player streams straight from it.
export const songUrl = (id: string) => `${API_BASE_URL}/auth/files/${encodeURIComponent(id)}`;

export const fetchSongs = async (): Promise<Song[]> => {
    const res = await axios.get<DriveFile[]>(`${API_BASE_URL}/auth/files`, {
        headers: { accept: "*/*" },
    });
    return res.data.map(toSong);
};

const toSong = (file: DriveFile): Song => ({
    id: file.id,
    title: cleanTitle(file.name),
    format: fileFormat(file),
    sizeBytes: file.size,
    // Drive has no album art, so each song gets a placeholder picture seeded by its ID.
    cover: `https://picsum.photos/seed/${file.id}/600`,
    downloaded: false,
});

// Turns Drive file names like "Yen Minukki-Masstamilan.In.mp3" into "Yen Minukki".
const cleanTitle = (fileName: string) => {
    const title = fileName
        .replace(/\.[a-z0-9]{2,4}$/i, "") // extension
        .replace(/\[[^\]]*\.[^\]]*\]/g, "") // site tags like [iSongs.info]
        .replace(/[\s-]*\w+\.(com|in|info|online|net)\b/gi, "") // site suffixes like -Masstamilan.In
        .replace(/^\s*\d{1,3}\s*[-.]\s+/, "") // leading track numbers like "01 - "
        .replace(/(\w)[-_](?=\w)/g, "$1 ") // Word-Word / Word_Word
        .replace(/\s{2,}/g, " ")
        .replace(/^[\s-]+|[\s-]+$/g, "");
    return title || fileName;
};

const fileFormat = (file: DriveFile) => {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : null;
    return (extension ?? file.mimeType.split("/").pop() ?? "").toUpperCase();
};

const formatSize = (bytes: number | null) => (bytes == null ? null : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);

export const formatTime = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = Math.floor(totalSec % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
};

// e.g. "MP3  •  6.4 MB"
export const songDetails = (song: Song) => [song.format, formatSize(song.sizeBytes)].filter(Boolean).join("  •  ");
