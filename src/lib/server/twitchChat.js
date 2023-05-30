import { Chat } from 'twitch-js';
import { onAuthenticationFailure } from './authentication.js';
import { io } from 'socket.io-client';
import chatBadgeTitles from '../../../static/data/chatBadgeTitles.json';

class TwitchChat {
  api;
  chat;
  connected = false;
  channel = '';
  maxMessages = 150;
  channelBadges;
  channelEmotes;
  globalBadges;
  globalEmotes;
  allBadges;
  badgesRegex = /badges=((?:[^;]+?\/[^;]+?,?)*);/;
  socket = io('http://localhost:5173', { 
    autoConnect: false
  });

  initialize(accessToken, refreshToken, username, globalBadges, globalEmotes, api) {
    this.api = api;
    this.globalEmotes = globalEmotes;
    this.globalBadges = globalBadges;
  
    this.chat = new Chat({
      token: accessToken,
      username: username,
      onAuthenticationFailure: () => onAuthenticationFailure(refreshToken),
      connectionTimeout: 15000,
      joinTimeout: 10000,
      log: {
        enabled: false
      }
    });
  
    this.chat.on('PRIVMSG', (message) => {
      const displayName = message.tags.displayName;
      const color = message.tags.color ? message.tags.color : this.getUserColor(message.username);
      const badgeInfo = this.deserializeRawMessage(message.tags.badgeInfo, ',', '/');

      const emoteUrls = this.getEmoteUrls(message.tags.emotes);
      let emotes = message.tags.emotes;
      emotes.forEach(emote => emote.url = emoteUrls[emote.id]);

      console.log(emotes);

      const badgesRaw = message._raw.match(this.badgesRegex)[1];
      let badges = this.deserializeRawMessage(badgesRaw, ',', '/');
      badges = this.getUserBadges(badges, badgeInfo);
  
      message = {
        message: {
          text: message.message,
          emotes: emotes
        },
        user: {
          displayName: displayName,
          color: color,
          badges: badges
        },
        type: 'chat'
      };

      this.socket.emit('message', message);
    });
  }

  async connect() {
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
  
  async join(channel, channelBadges, channelEmotes) {
    if (!chat || this.channel == channel) {
      return
    }

    this.channelEmotes = channelEmotes;
    this.channelBadges = channelBadges;
    this.allBadges = this.channelBadges.concat(this.globalBadges);
    
    // if connected to a channel already, part from it before joining another one
    if (this.channel) {
      await this.chat.part(this.channel).then(() => {
        console.log('chat parted');
      }).catch(() => {
        console.log("chat part failed");
      });
    }
  
    await this.chat.join(channel).then(() => {
      this.channel = channel;
      console.log("chat joined");
    }).catch(() => {
      console.log("chat join failed");
    });

    return;
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

  async getEmoteUrls(emotes) {
    let urls = emotes.reduce((o, emote) => ({...o, [emote.id]: ''}), {});

    for (const emote of emotes) {
      // check channelEmotes for emote url
      for (const set of this.channelEmotes.data) {
        if (set.id == emote.id) {
          const url = this.channelEmotes.template.replace('{{id}}/{{format}}/{{theme_mode}}/{{scale}}', `${emote.id}/static/dark/1.0`);
          urls[emote.id] = url;
          break;
        }
      }

      // check globalEmotes for emote url
      for (const set of this.globalEmotes.data) {
        if (set.id == emote.id) {
          const url = this.globalEmotes.template.replace('{{id}}/{{format}}/{{theme_mode}}/{{scale}}', `${emote.id}/static/dark/1.0`);
          urls[emote.id] = url;
          break;
        }
      }
    }

    // if a url was found for every emote then return
    if (Object.values(urls).every(url => url)) {
      return emotes;
    }

    // get emote sets for any emote not found in the channel or global emote sets
    const emoteSetIds = Object.keys(urls).filter(id => !urls[id]);
    const numIds = 25;

    for (let i = 0; i < emoteSetIds.length; i += numIds) {
      const searchIds = emoteSetIds.slice(i, i + numIds);
      const emoteSets = await this.api.get('chat/emotes/set', {
        search: {
          emote_set_id: searchIds
        }
      });

      for (const id of searchIds) {
        for (const set of emoteSets.data) {
          if (set.id == id) {
            const url = emoteSets.template.replace('{{id}}/{{format}}/{{theme_mode}}/{{scale}}', `${id.id}/static/dark/1.0`);
            urls[id] = url;
            break;
          }
        }
      }
    }

    return emotes;
  }

  getUserBadges(badges, badgeInfo) {
    let userBadges = [];

    for (const badge in badges) {
      let title = '';
      let url = '';

      // get badge title
      if (badge == 'subscriber') {
        const monthsSubscribed = parseInt(badgeInfo[badge]);
        title = this.getSubscriberBadgeTitle(monthsSubscribed);
      } else {
        const version = this.getSetVersion(chatBadgeTitles, badge, badges[badge]);

        if (version.title) {
          title = version.title;
        }
      }

      // get badge image url
      const version = this.getSetVersion(this.allBadges, badge, badges[badge]);

      if (version.imageUrl1X) {
        url = version.imageUrl1X;
      }

      if (title && url) {
        userBadges.push({
          title: title,
          url: url
        });
      }
    }

    return userBadges;
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