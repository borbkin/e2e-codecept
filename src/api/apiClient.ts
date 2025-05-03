import axios from 'axios';

const API_URL = 'https://automationexercise.com/api';

export async function createUserViaAPI(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const formData = new URLSearchParams();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('title', 'Mr');
    formData.append('birth_date', '03');
    formData.append('birth_month', 'April');
    formData.append('birth_year', '1994');
    formData.append('firstname', 'Test');
    formData.append('lastname', 'User');
    formData.append('address1', '123 Test Street');
    formData.append('country', 'Canada');
    formData.append('state', 'Ontario');
    formData.append('city', 'Toronto');
    formData.append('zipcode', 'M1M1M1');
    formData.append('mobile_number', '+1234567890');
  
    const response = await axios.post(`${API_URL}/createAccount`, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  
    if (response.data?.responseCode !== 201) {
      throw new Error(`❌ createUserViaAPI failed: ${response.data?.message}`);
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
    data: formData.toString()
  });

  if (response.data?.responseCode !== 200) {
    console.warn(`⚠️ deleteUserViaAPI warning: ${response.data?.message}`);
  }
}
