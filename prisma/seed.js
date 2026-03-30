const { PrismaClient } = require("../src/generated/prisma");

const db = new PrismaClient();

const creatorId = 1;

db.user.create({
  data: {
    name: "Admin",
    email: "admin@gmail.com",
    password: "123456",
  },
});

const movies = [
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets...",
    releaseYear: 2010,
    genres: ["Sci-Fi"],
    rating: 8.8,
    directorId: creatorId,
  },
  {
    title: "The Matrix",
    overview: "A computer hacker learns...",
    releaseYear: 1999,
    genres: ["Action"],
    rating: 8.7,
    directorId: creatorId,
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel...",
    releaseYear: 2014,
    genres: ["Sci-Fi"],
    rating: 8.6,
    directorId: creatorId,
  },
  {
    title: "Tenet",
    overview: "A man travels back in time...",
    releaseYear: 2020,
    genres: ["Action"],
    rating: 7.3,
    directorId: creatorId,
  },
  {
    title: "Dunkirk",
    overview: "Allied soldiers are surrounded...",
    releaseYear: 2017,
    genres: ["War"],
    rating: 7.9,
    directorId: creatorId,
  },
];

const main = async () => {
  console.log("Seeding database with movies...");

  for (const movie of movies) {
    await db.movie.create({ data: movie });
    console.log(`Movie created: ${movie.title}`);
  }

  console.log("Database seeding completed!");
};

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
