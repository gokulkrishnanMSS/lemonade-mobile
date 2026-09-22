export type Seeder = {
    id: string;
    name: string;
    seeds: number;
    photo: string;
};

// Dummy data with random placeholder photos until the backend has seeders.
export const TOP_SEEDERS: Seeder[] = [
    { id: "s1", name: "Aadhi", seeds: 2480, photo: "https://i.pravatar.cc/200?u=seeder-s1" },
    { id: "s2", name: "Keerthana", seeds: 1935, photo: "https://i.pravatar.cc/200?u=seeder-s2" },
    { id: "s3", name: "Harish", seeds: 1712, photo: "https://i.pravatar.cc/200?u=seeder-s3" },
    { id: "s4", name: "Swetha", seeds: 1540, photo: "https://i.pravatar.cc/200?u=seeder-s4" },
    { id: "s5", name: "Naveen", seeds: 1288, photo: "https://i.pravatar.cc/200?u=seeder-s5" },
    { id: "s6", name: "Lavanya", seeds: 1102, photo: "https://i.pravatar.cc/200?u=seeder-s6" },
    { id: "s7", name: "Pranav", seeds: 964, photo: "https://i.pravatar.cc/200?u=seeder-s7" },
    { id: "s8", name: "Ishwarya", seeds: 870, photo: "https://i.pravatar.cc/200?u=seeder-s8" },
];

// 964 -> "964", 1935 -> "1.9k"
export const formatSeeds = (seeds: number) => (seeds >= 1000 ? `${(seeds / 1000).toFixed(1)}k` : `${seeds}`);
