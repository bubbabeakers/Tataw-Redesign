import { Chat } from 'twitch-js';
import { onAuthenticationFailure } from './authentication.js';
import { io } from 'socket.io-client';
import { domain, emoteUrl } from '../consts.js';
import chatBadgeTitles from '../../../static/data/chatBadgeTitles.json';

class TwitchChat {
  chat;
  connected = false;
  channel = '';
  maxMessages = 150;
  socket = io(domain, { autoConnect: false });
  
  channelBadges;
  globalBadges;
  allBadges;

  actionMessageRegex = /^\u0001ACTION (.*)\u0001$/m;
  badgesRegex = /badges=((?:[^;]+?\/[^;]+?,?)*);/;
  urlRegex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/gi;

  initialize(accessToken, refreshToken, username, globalBadges) {
    this.globalBadges = globalBadges;
  
    this.chat = new Chat({
      token: accessToken,
      username: username,
      onAuthenticationFailure: () => onAuthenticationFailure(refreshToken),
      connectionTimeout: 10000,
      joinTimeout: 10000,
      log: { enabled: false }
    });
  
    this.chat.on('PRIVMSG', (_message) => {
      const actionMessage = _message.tags.isModerator && this.actionMessageRegex.test(_message.message);
      const color = _message.tags.color ? _message.tags.color : this.getUserColor(_message.username);
      const displayName = _message.tags.displayName;
      const badges = this.getBadges(_message._raw, _message.tags.badgeInfo);
      const parsedMessage = this.parseMessage(_message.message, _message.tags.emotes);

      const message = {
        badges: badges,
        color: color,
        displayName: displayName,
        message: parsedMessage,
        type: actionMessage ? 'action' : 'chat'
      };

      this.socket.emit('message', message);
    });
  }

  async connect() {
    if (!this.chat) {
      return false;
    } else if (this.connected) {
      return true;
    }

    this.socket.connect();
    
    this.connected = await this.chat.connect().then(() => {
      console.log("chat connected");
      return true;
    }).catch(() => {
      console.log("chat connect failed");
      return false;
    });
  
    return this.connected;
  }
  
  async disconnect() {
    if (!this.chat) {
      return true;
    } else if(!this.connected) {
      return false;
    }

    this.connected = await this.chat.disconnect().then(() => {
      console.log("chat disconnected");

      this.channel = '';
      this.chat = undefined;
      this.socket.disconnect();

      return false;
    }).catch(() => {
      console.log("chat disconnect failed");
      return true;
    });
  
    return this.connected;
  }
  
  async join(channel, channelBadges) {
    if (!this.chat) {
      return false;
    } else if (this.channel == channel) {
      return true;
    }

    this.channelBadges = channelBadges;
    this.allBadges = this.channelBadges.concat(this.globalBadges);
    
    // if connected to a channel already, part from it before joining another one
    if (this.channel) {
      let parted = await this.chat.part(this.channel).then(() => {
        console.log('chat parted');
        return true;
      }).catch(() => {
        console.log("chat part failed");
        return false;
      });

      if (!parted) {
        return false;
      }
    }
  
    let joined = await this.chat.join(channel).then(() => {
      this.channel = channel;
      console.log("chat joined");
      return true;
    }).catch(() => {
      this.channel = '';
      console.log("chat join failed");
      return false;
    });

    return joined;
  }
  
  getUserColor(username) {
    const defaultColors = [
      "Red",
      "Blue",
      "Green",
      "FireBrick",
      "Coral",
      "YellowGreen",
      "OrangeRed",
      "SeaGreen",
      "GoldenRod",
      "Chocolate",
      "CadetBlue",
      "DodgerBlue",
      "HotPink",
      "BlueViolet",
      "SpringGreen",
    ];
  
    const n = username.charCodeAt(0) + username.charCodeAt(username.length - 1);
    const color = defaultColors[n % defaultColors.length];
  
    return color;
  }

  deserializeRawMessage(message, delimeter, separator) {
    if (!message) {
      return {};
    }

    return message.split(delimeter).reduce((obj, badge) => {
      const separatorIndex = badge.indexOf(separator);
      const key = badge.slice(0, separatorIndex);
      const value = badge.slice(separatorIndex + 1);

      obj[key] = value;

      return obj;
    }, {});
  }

  parseMessage(message, emotes) {
    // remove action message delimeters if they exist
    message = message.replace(this.actionMessageRegex, '$1');

    let urls = [...message.matchAll(this.urlRegex)].map(match => ({ start: match.index, end: match.index + match[0].length }));

    // if there are no emotes or urls to parse then just return the original message
    if (emotes.length === 0 && urls.length === 0) {
      return [{
        type: 'text',
        value: message
      }];
    }

    let parsedMessage = [];
    let piece = {};
    let messageIndex = 0;
    let emoteIndex = 0;
    let urlIndex = 0;

    do {
      if (messageIndex === emotes[emoteIndex]?.start) {
        let emote = message.slice(emotes[emoteIndex].start, emotes[emoteIndex].end + 1);
        let url1X = emoteUrl.replace('{{id}}/{{format}}/{{theme_mode}}/{{scale}}', `${emotes[emoteIndex].id}/static/dark/1.0`);
        let url2X = emoteUrl.replace('{{id}}/{{format}}/{{theme_mode}}/{{scale}}', `${emotes[emoteIndex].id}/static/dark/2.0`);

        piece = {
          type: 'emote',
          value: {
            emote: emote,
            url1X: url1X,
            url2X: url2X
          } 
        };

        messageIndex = emotes[emoteIndex].end + 1;
        emoteIndex += 1;
      } else if (messageIndex === urls[urlIndex]?.start) {
        let url = message.slice(urls[urlIndex].start, urls[urlIndex].end);

        piece = {
          type: 'url',
          value: url
        };

        messageIndex = urls[urlIndex].end;
        urlIndex += 1;
      } else if (messageIndex < emotes[emoteIndex]?.start || messageIndex < urls[urlIndex]?.start) {
        let textEnd = Math.min(isNaN(emotes[emoteIndex]?.start) ? Infinity : emotes[emoteIndex].start, isNaN(urls[urlIndex]?.start) ? Infinity : urls[urlIndex].start);
        let text = message.slice(messageIndex, textEnd);

        piece = {
          type: 'text',
          value: text
        };

        messageIndex = textEnd;
      } else {
        let text = message.slice(messageIndex);

        piece = {
          type: 'text',
          value: text
        };

        messageIndex = message.length;
      }

      parsedMessage.push(piece);
    } while (messageIndex < message.length);

    return parsedMessage;
  }

  getBadges(rawMessage, rawBadgeInfo) {
    const rawBadges = rawMessage.match(this.badgesRegex)[1];
    const badgeInfo = this.deserializeRawMessage(rawBadgeInfo, ',', '/');
    const badges = this.deserializeRawMessage(rawBadges, ',', '/');
    let badgesFound = [];

    for (const badge in badges) {
      let name = '';
      let url = '';

      // get badge title
      if (badge == 'subscriber') {
        const monthsSubscribed = parseInt(badgeInfo[badge]);
        name = this.getSubscriberBadgeTitle(monthsSubscribed);
      } else {
        const version = this.getSetVersion(chatBadgeTitles, badge, badges[badge]);

        if (version.title) {
          name = version.title;
        }
      }

      // get badge image url
      const version = this.getSetVersion(this.allBadges, badge, badges[badge]);

      if (version.imageUrl1X) {
        url = version.imageUrl1X;
      }

      if (name && url) {
        badgesFound.push({
          name: name,
          url: url
        });
      }
    }

    return badgesFound;
  }

  getSubscriberBadgeTitle(monthsSubscribed) {
    if (monthsSubscribed < 1) {
      return '';
    }

    const monthsInYear = 12;
    
    if (monthsSubscribed >= monthsInYear) {
      const yearsSubscribed = Math.floor((monthsSubscribed / monthsInYear) * 2) / 2;
      return `${monthsSubscribed}-Month Subscriber (${yearsSubscribed}-Year Badge)`;
    }

    let monthBadge;

    switch (monthsSubscribed) {
      case 1:
        monthBadge = 1;
        break;
      case 2:
        monthBadge = 2;
        break;
      case 3:
      case 4:
      case 5:
        monthBadge = 3;
        break;
      case 6:
      case 7:
      case 8:
        monthBadge = 6;
        break;
      default:
        monthBadge = 9;
    }
    
    return `${monthBadge}-Month Badge`;
  }

  getSetVersion(badges, setId, versionId) {
    for (const set of badges) {
      if (set.setId == setId) {
        for (const version of set.versions) {
          if (version.id == versionId) {
            return version;
          }
        }
      }
    }
    // if no version was found return an empty object
    return {};
  }
}

let chat = new TwitchChat();

export default chat;