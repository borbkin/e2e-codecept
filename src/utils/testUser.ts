import { faker } from '@faker-js/faker';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  title: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export function buildTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: faker.internet.password({ length: 10, memorable: false }),
    title: 'Mr',
    birthDay: '3',
    birthMonth: 'April',
    birthYear: '1994',
    firstName,
    lastName,
    address: faker.location.streetAddress(),
    country: 'Canada',
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode('#####'),
    mobileNumber: `+1${faker.string.numeric(10)}`,
    ...overrides
  };
}
