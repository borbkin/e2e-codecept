import { faker } from '@faker-js/faker';

export function generateUserData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10, memorable: false }),
  };
}