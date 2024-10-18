import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = [];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.users.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profile: {
          create: {
            identity_type: faker.helpers.arrayElement(["KTP", "SIM", "Passport"]),
            identity_number: faker.string.numeric(9),
            address: faker.address.streetAddress(true),
          },
        },
        bank_account: {
          create: {
            bank_name: faker.company.name(),
            bank_account_number: faker.string.numeric(9),
            balance: parseInt(faker.finance.amount(1000, 5000, 0)),
          },
        },
      },
      include: {
        bank_account: true,
      },
    });

    console.log(`Created user with id: ${user.id}, and bank account`);
    users.push(user);
  }

  for (let i = 0; i < 15; i++) {
    const sourceIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const destinationIndex = faker.number.int({ min: 0, max: users.length - 1 });

    if (sourceIndex !== destinationIndex) {
      const sourceUser = users[sourceIndex];
      const destinationUser = users[destinationIndex];

      const sourceAccount = sourceUser.bank_account[0];
      const destinationAccount = destinationUser.bank_account[0];

      const amount = parseInt(faker.finance.amount(100, 1000, 0));

      const transaction = await prisma.transactions.create({
        data: {
          source_account_id: sourceAccount.id,
          destination_account_id: destinationAccount.id,
          amount: amount,
        },
      });

      console.log(`Created transaction with id: ${transaction.id} from account ${sourceAccount.id} to ${destinationAccount.id} for amount ${amount}`);
    } else {
      i--;
    }
  }
}

main()
  .catch((e) => {
    console.error("Error in main function:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
