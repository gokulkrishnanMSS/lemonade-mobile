export type MusicUser = {
    id: string;
    name: string;
    tastePoints: number;
    rating: number; // 0-5
    online: boolean;
    color: string; // card background
};

// Dummy data until the backend has a users API.
export const USERS: MusicUser[] = [
    { id: "u1", name: "Arun Kumar", tastePoints: 92, rating: 4.8, online: true, color: "#F7B858" },
    { id: "u2", name: "Priya Sharma", tastePoints: 87, rating: 4.5, online: true, color: "#F48FB1" },
    { id: "u3", name: "Karthik Raja", tastePoints: 78, rating: 4.1, online: false, color: "#7CC6FE" },
    { id: "u4", name: "Divya Menon", tastePoints: 95, rating: 4.9, online: true, color: "#9BE15D" },
    { id: "u5", name: "Rahul Varma", tastePoints: 64, rating: 3.6, online: false, color: "#B69CFF" },
    { id: "u6", name: "Meera Joseph", tastePoints: 81, rating: 4.3, online: true, color: "#5EEAD4" },
    { id: "u7", name: "Sanjay Pillai", tastePoints: 70, rating: 3.9, online: false, color: "#FF8A65" },
    { id: "u8", name: "Nila Krishnan", tastePoints: 89, rating: 4.6, online: true, color: "#FFE066" },
];

export const initials = (name: string) =>
    name
        .split(" ")
        .map(part => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
