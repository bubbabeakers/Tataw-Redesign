const authorizationUrl = 'https://id.twitch.tv/oauth2/authorize';
const logoutUrl = 'https://id.twitch.tv/logout/redirect';
const redirectUrl = 'http://localhost:5173/api/authenticate';
const tokenUrl = 'https://id.twitch.tv/oauth2/token';
const accessTokenMaxAge = 60 * 60;
const refreshTokenMaxAge = 60 * 60 * 24 * 7;
const userMaxAge = 2147483647;
const scopes = 'chat:read chat:edit chat_login user:read:follows clips:edit';

export { authorizationUrl, logoutUrl, redirectUrl, tokenUrl, accessTokenMaxAge, refreshTokenMaxAge, userMaxAge, scopes };