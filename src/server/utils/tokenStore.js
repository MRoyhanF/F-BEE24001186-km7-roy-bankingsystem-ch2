const loggedOutTokens = [];

export const storeToken = (token) => {
  if (loggedOutTokens.length >= 50) {
    loggedOutTokens.length = 0;
  }
  loggedOutTokens.push(token);
};

export const isTokenLoggedOut = (token) => {
  return loggedOutTokens.includes(token);
};
