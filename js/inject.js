getStore().then(store => {
  addEventListener("message", function({
    data: { timeToSend, momName, msgToSend, isOn } = {}
  } = {}) {
    if (timeToSend && momName && msgToSend && isOn) {
      const now = new Date();
      const [hour, minute] = timeToSend.split(":");

      const lastMsg = getLastSentMsg({ username: momName, store });
      const timeLastMsg = lastMsg.__x_t * 1000;

      if (!isNaN(hour) && !isNaN(minute) && !isNaN(timeLastMsg)) {
        const dateLastMsg = new Date(timeLastMsg);

        const dateToSend = new Date(
          dateLastMsg.getFullYear(),
          dateLastMsg.getMonth(),
          dateLastMsg.getDate(),
          hour,
          minute
        );

        if (now.getTime() >= dateToSend.getTime()) {
          if (timeLastMsg < dateToSend.getTime()) {
            sendMsg({
              username: momName,
              store,
              message: msgToSend
            });
          }
        }
      }
    }
  });
});

function getStore() {
  return new Promise(resolve => {
    let store_id;

    setTimeout(function() {
      const modules = getAllModules()._value;

      for (const key in modules) {
        if (modules[key].exports) {
          if (modules[key].exports.default) {
            if (modules[key].exports.default.Wap) {
              store_id = modules[key].id.replace(/"/g, '"');
            }
          }
        }
      }
    }, 5000);

    setTimeout(function() {
      const store = _requireById(store_id).default;
      console.log("Store is ready");
      resolve(store);
    }, 7000);
  });
}

function _requireById(id) {
  return window.webpackJsonp([], null, [id]);
}

function getAllModules() {
  return new Promise(resolve => {
    const id = _.uniqueId("fakeModule_");
    window.webpackJsonp(
      [],
      {
        [id]: function(module, exports, __webpack_require__) {
          resolve(__webpack_require__.c);
        }
      },
      [id]
    );
  });
}

function sendMsg({ username, message, store }) {
  const Chats = store.Chat.models;
  for (chat in Chats) {
    if (isNaN(chat)) {
      continue;
    }
    const user = {};
    user.name = Chats[chat].__x_formattedTitle;
    user.id = Chats[chat].__x_id;
    if (user.name === username) {
      Chats[chat].sendMessage(message);
      return true;
    }
  }
}

function isChatMessage(message) {
  if (message.__x_isSentByMe) {
    return false;
  }
  if (message.__x_isNotification) {
    return false;
  }
  if (!message.__x_isUserCreatedType) {
    return false;
  }
  return true;
}
function getUnreadChats(store) {
  const chats = store.Chat.models;
  const output = [];

  for (chat in chats) {
    if (isNaN(chat)) {
      continue;
    }
    const temp = {};
    temp.contact = chats[chat].__x_formattedTitle;
    temp.id = chats[chat].__x_id;
    temp.messages = [];
    const messages = chats[chat].msgs.models;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (!messages[i].__x_isNewMsg) {
        break;
      } else {
        if (!isChatMessage(messages[i])) {
          continue;
        }
        messages[i].__x_isNewMsg = false;
        temp.messages.push({
          message: messages[i].__x_body,
          timestamp: messages[i].__x_t,
          type: messages[i].__x_type,
          e: messages[i]
        });
      }
    }
    if (temp.messages.length > 0) {
      output.push(temp);
    }
  }
  return output;
}

function getLastSentMsg({ username, store }) {
  const chats = store.Chat.models;
  const { msgs: { models: chatMsgs } = {} } =
    chats.find(chat => chat.__x_formattedTitle === username) || {};
  for (let i = chatMsgs.length - 1; i > -1; i--) {
    const {
      __x_id: { fromMe }
    } = chatMsgs[i];
    if (fromMe) {
      return chatMsgs[i];
    }
  }
  return {};
}
