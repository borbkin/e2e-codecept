export const LoginPage = {
    url: '/login',
    signupName: '[data-qa="signup-name"]',
    signupEmail: '[data-qa="signup-email"]',
    signupButton: '[data-qa="signup-button"]',
  
    emailField: '[data-qa="login-email"]',
    passwordField: '[data-qa="login-password"]',
    submitButton: '[data-qa="login-button"]',
    
    loggedInText: (name: string) => `Logged in as ${name}`,
    loginTitle: 'Login to your account',
  
    createAccountPassword: '#password',
    createButton: '[data-qa="create-account"]',
    continueButton: '[data-qa="continue-button"]',
  
    logoutLink: 'Logout',
    accountCreatedMessage: 'Account Created!',
  
    cookiesConsentButton: '.fc-cta-consent'
  };