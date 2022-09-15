import { faker } from "@faker-js/faker";

export default function itemFactory() {
  return {
    title: faker.lorem.words(2),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    amount: 1230,
  };
}
