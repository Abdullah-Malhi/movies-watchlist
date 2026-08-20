import { prisma } from "../src/config/db.js";

const creatorId = "c0706616-9bfe-4413-ae38-69d5278cc00e"; // Replace with an existing user id if necessary

const movies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        releaseYear: 2010,
        genres: ["Science Fiction"],
        runtime: 148,
        postURL: null,
        overview: null,
        createdBy: creatorId,
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
        releaseYear: 2008,
        genres: ["Action"],
        runtime: 152,
        postURL: null,
        overview: null,
        createdBy: creatorId,
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseYear: 2014,
        genres: ["Adventure"],
        runtime: 169,
        postURL: null,
        overview: null,
        createdBy: creatorId,
    },
];

const main = async () => {
    try {
        await prisma.$connect();
        await prisma.movie.createMany({ data: movies, skipDuplicates: true });
        console.log("Movies seeded successfully!");
    } catch (error) {
        console.error("Error seeding movies:", error);
    } finally {
        await prisma.$disconnect();
    }
};

main().catch((error) => {
    console.error("Error in main function:", error);
    prisma.$disconnect();
}).finally(() => {
    process.exit(0);
});


