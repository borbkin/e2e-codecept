Feature('User Registration');

Scenario('Регистрация нового пользователя', async ({ I }) => {
  const name = 'Тестовый Котик';
  const email = `test_${Date.now()}@example.com`;
  const password = '123456';

  await I.registerNewUser(name, email, password);
});