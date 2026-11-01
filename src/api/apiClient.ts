import axios, { AxiosInstance } from 'axios';
import { TestUser } from '../utils/testUser';
import { buildURL } from '../config/environment';

const API_URL = buildURL('api').replace(/\/$/, '');
const API_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS ?? 30_000);

interface ApiClientOptions {
  client?: AxiosInstance;
  baseURL?: string;
}

export async function createUserViaAPI(user: TestUser, options: ApiClientOptions = {}) {
  const client = options.client ?? axios;
  const baseURL = options.baseURL ?? API_URL;
  const formData = new URLSearchParams();
  formData.append('name', user.name);
  formData.append('email', user.email);
  formData.append('password', user.password);
  formData.append('title', user.title);
  formData.append('birth_date', user.birthDay);
  formData.append('birth_month', user.birthMonth);
  formData.append('birth_year', user.birthYear);
  formData.append('firstname', user.firstName);
  formData.append('lastname', user.lastName);
  formData.append('address1', user.address);
  formData.append('country', user.country);
  formData.append('state', user.state);
  formData.append('city', user.city);
  formData.append('zipcode', user.zipcode);
  formData.append('mobile_number', user.mobileNumber);

  const response = await client.post(`${baseURL}/createAccount`, formData.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: API_TIMEOUT_MS
  });

  if (response.data?.responseCode !== 201) {
    throw new Error(`createUserViaAPI failed: ${response.data?.message}`);
  }
}

export async function deleteUserViaAPI(data: {
  email: string;
  password: string;
}, options: ApiClientOptions = {}) {
  const client = options.client ?? axios;
  const baseURL = options.baseURL ?? API_URL;
  const formData = new URLSearchParams();
  formData.append('email', data.email);
  formData.append('password', data.password);

  const response = await client.delete(`${baseURL}/deleteAccount`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: formData.toString(),
    timeout: API_TIMEOUT_MS
  });

  // Cleanup is idempotent: the UI may already have deleted the account.
  if (response.data?.responseCode !== 200 && response.data?.responseCode !== 404) {
    throw new Error(
      `deleteUserViaAPI failed: responseCode=${response.data?.responseCode}, message=${response.data?.message}`
    );
  }
}
