import axios from 'axios';
import { TestUser } from '../utils/testUser';

const API_URL = 'https://automationexercise.com/api';
const API_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS ?? 10_000);

export async function createUserViaAPI(user: TestUser) {
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

  const response = await axios.post(`${API_URL}/createAccount`, formData.toString(), {
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
}) {
  const formData = new URLSearchParams();
  formData.append('email', data.email);
  formData.append('password', data.password);

  const response = await axios.delete(`${API_URL}/deleteAccount`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: formData.toString(),
    timeout: API_TIMEOUT_MS
  });

  if (response.data?.responseCode !== 200) {
    throw new Error(
      `deleteUserViaAPI failed: responseCode=${response.data?.responseCode}, message=${response.data?.message}`
    );
  }
}
