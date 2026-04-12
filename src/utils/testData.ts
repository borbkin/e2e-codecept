import { faker } from '@faker-js/faker';

export interface TestAddress {
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface TestProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
}

export interface TestOrder {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: TestAddress;
  billingAddress: TestAddress;
  products: TestProduct[];
  comment: string;
}

export function buildTestAddress(overrides: Partial<TestAddress> = {}): TestAddress {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
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

export function buildTestProduct(overrides: Partial<TestProduct> = {}): TestProduct {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 10, max: 500, dec: 2 })),
    quantity: faker.number.int({ min: 1, max: 5 }),
    category: faker.commerce.department(),
    brand: faker.company.name(),
    ...overrides
  };
}

export function buildTestOrder(overrides: Partial<TestOrder> = {}): TestOrder {
  const shippingAddress = buildTestAddress();
  const billingAddress = buildTestAddress({
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName
  });
  const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
  const email = faker.internet.email({
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName
  }).toLowerCase();

  return {
    id: faker.string.uuid(),
    customerName,
    email,
    shippingAddress,
    billingAddress,
    products: [buildTestProduct()],
    comment: faker.lorem.sentence(),
    ...overrides
  };
}
