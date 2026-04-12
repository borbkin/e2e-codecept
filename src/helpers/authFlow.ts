import { AuthForm } from '../fragments/AuthForm';
import { Header } from '../fragments/Header';
import { AccountConfirmation } from '../fragments/AccountConfirmation';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { TestUser } from '../utils/testUser';

export async function openAuthPage(I: CodeceptJS.I) {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();
}

export async function loginThroughUi(I: CodeceptJS.I, user: Pick<TestUser, 'email' | 'password' | 'name'>) {
  await I.fillField(AuthForm.loginEmailField, user.email);
  await I.fillField(AuthForm.loginPasswordField, user.password);
  await I.click(AuthForm.loginSubmitButton);
  await assertLoggedIn(I, user.name);
}

export async function assertLoggedIn(I: CodeceptJS.I, name: string) {
  await I.waitForText('Logged in as', 10);
  await I.see(Header.loggedInText(name));
}

export async function submitSignupForm(I: CodeceptJS.I, user: Pick<TestUser, 'name' | 'email'>) {
  await I.fillField(AuthForm.signupNameField, user.name);
  await I.fillField(AuthForm.signupEmailField, user.email);
  await I.click(AuthForm.signupButton);
}

export async function completeRegistrationForm(I: CodeceptJS.I, user: TestUser) {
  await I.waitForElement(RegistrationPage.passwordField, 5);
  await I.fillField(RegistrationPage.passwordField, user.password);
  await I.selectOption(RegistrationPage.daySelect, user.birthDay);
  await I.selectOption(RegistrationPage.monthSelect, user.birthMonth);
  await I.selectOption(RegistrationPage.yearSelect, user.birthYear);
  await I.fillField(RegistrationPage.firstNameField, user.firstName);
  await I.fillField(RegistrationPage.lastNameField, user.lastName);
  await I.fillField(RegistrationPage.addressField, user.address);
  await I.selectOption(RegistrationPage.countrySelect, user.country);
  await I.fillField(RegistrationPage.stateField, user.state);
  await I.fillField(RegistrationPage.cityField, user.city);
  await I.fillField(RegistrationPage.zipcodeField, user.zipcode);
  await I.fillField(RegistrationPage.mobileField, user.mobileNumber);
  await I.click(RegistrationPage.createAccountButton);
}

export async function completeAccountConfirmation(I: CodeceptJS.I) {
  await I.waitForText(AccountConfirmation.accountCreatedMessage, 10);
  await I.click(AccountConfirmation.continueButton);
}

export async function assertLoggedOut(I: CodeceptJS.I) {
  await I.see(AuthForm.loginTitle, AuthForm.loginForm);
}

export async function deleteAccountThroughUi(I: CodeceptJS.I) {
  await I.seeElement(Header.deleteAccountLinkSelector);

  await I.usePlaywrightTo('перейти на страницу удаления аккаунта', async ({ page }) => {
    const deleteAccountLink = page.locator(Header.deleteAccountLinkSelector).first();

    await deleteAccountLink.waitFor({ state: 'visible', timeout: 10000 });
    await deleteAccountLink.scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL(/\/delete_account(?:[/?#]|$)/, { timeout: 20000 }),
      deleteAccountLink.click({ force: true })
    ]);
  });

  await I.waitForElement(AccountConfirmation.accountDeletedBanner, 20);
  await I.see(AccountConfirmation.accountDeletedMessage, AccountConfirmation.accountDeletedBanner);
  await I.waitForElement(AccountConfirmation.continueButton, 10);
  await I.click(AccountConfirmation.continueButton);
  await I.see(Header.signupOrLoginLink);
}
