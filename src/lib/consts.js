const authorizationUrl = 'https://id.twitch.tv/oauth2/authorize';
const emoteUrl = 'https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}';
const logoutUrl = 'https://id.twitch.tv/logout/redirect';
const domain = 'http://localhost:5173';
const redirectUrl = `${domain}/api/authenticate`;
const tokenUrl = 'https://id.twitch.tv/oauth2/token';
const accessTokenMaxAge = 60 * 60;
const refreshTokenMaxAge = 60 * 60 * 24 * 7;
const userMaxAge = 2147483647;
const scopes = 'chat:read chat:edit user:read:follows clips:edit';

export { authorizationUrl, domain, emoteUrl, logoutUrl, redirectUrl, tokenUrl, accessTokenMaxAge, refreshTokenMaxAge, userMaxAge, scopes };