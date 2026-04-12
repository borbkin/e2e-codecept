import { AuthForm } from '../fragments/AuthForm';
import { Header } from '../fragments/Header';
import { AccountConfirmation } from '../fragments/AccountConfirmation';

export const LoginPage = {
  url: '/login',
  signupName: AuthForm.signupNameField,
  signupEmail: AuthForm.signupEmailField,
  signupButton: AuthForm.signupButton,
  emailField: AuthForm.loginEmailField,
  passwordField: AuthForm.loginPasswordField,
  submitButton: AuthForm.loginSubmitButton,
  loginForm: AuthForm.loginForm,
  signupForm: AuthForm.signupForm,
  loginTitle: AuthForm.loginTitle,
  duplicateEmailError: AuthForm.duplicateEmailError,
  createAccountPassword: '#password',
  createButton: '[data-qa="create-account"]',
  continueButton: AccountConfirmation.continueButton,
  signupOrLoginLink: Header.signupOrLoginLink,
  loggedInText: Header.loggedInText,
  logoutLink: Header.logoutLink,
  deleteAccountLink: Header.deleteAccountLink,
  deleteAccountLinkSelector: Header.deleteAccountLinkSelector,
  accountCreatedMessage: AccountConfirmation.accountCreatedMessage,
  accountDeletedBanner: AccountConfirmation.accountDeletedBanner,
  accountDeletedMessage: AccountConfirmation.accountDeletedMessage
};
