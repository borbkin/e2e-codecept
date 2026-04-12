import { faker } from '@faker-js/faker';
import { buildTestAddress } from './testData';

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
  const address = buildTestAddress();
  const firstName = address.firstName;
  const lastName = address.lastName;

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
    address: address.address,
    country: address.country,
    state: address.state,
    city: address.city,
    zipcode: address.zipcode,
    mobileNumber: address.mobileNumber,
    ...overrides
  };
}
