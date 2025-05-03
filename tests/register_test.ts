Feature('User Registration');

Scenario('Успешная регистрация нового пользователя', async ({ I }) => {
  const email = `test_${Date.now()}@example.com`;

  await I.amOnPage('/login');
  await I.acceptCookiesIfVisible();

  // Шаг 1: ввод имени и email
  await I.fillField('[data-qa="signup-name"]', 'Тестовый Котик');
  await I.fillField('[data-qa="signup-email"]', email);
  await I.click('[data-qa="signup-button"]');

  // Шаг 2: заполнение формы (можно адаптировать)
  await I.waitForElement('#password', 5);
  await I.fillField('#password', '123456');
  await I.click('[id="days"]');
  await I.selectOption('#days', '3');
  await I.selectOption('#months', 'April');
  await I.selectOption('#years', '1994');

  await I.fillField('#first_name', 'Котик');
  await I.fillField('#last_name', 'Тестовый');
  await I.fillField('#address1', 'Пушистая 123');
  await I.selectOption('#country', 'Canada');
  await I.fillField('#state', 'Мурская');
  await I.fillField('#city', 'Лапкино');
  await I.fillField('#zipcode', '123456');
  await I.fillField('#mobile_number', '+1234567890');

  await I.click('[data-qa="create-account"]');

  // Шаг 3: подтверждение
  await I.waitForText('Account Created!', 10);
  await I.click('[data-qa="continue-button"]');

  // Проверка входа
  await I.see('Logged in as Тестовый Котик');
});