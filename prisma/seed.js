import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create 10 users
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.firstName(),
        posts: {
          create: [
            {
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraph(),
              published: faker.datatype.boolean(),
            },
            {
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraph(),
              published: faker.datatype.boolean(),
            },
          ],
        },
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
