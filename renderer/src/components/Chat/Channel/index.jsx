import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Redirect } from "react-router";
import tmi from "tmi.js";
import { TabsContext } from "../../../contexts/Tabs/tabs.context";
import "./style.css";
import parse from "html-react-parser";
import { OptionsContext } from "../../../contexts/Options/options.context";
import { AuthContext } from "../../../contexts/Auth/auth.context";
import { CLIENT_ID } from "../../../constants";

const Channel = () => {
  const {
    removeTab,
    tabs,
    updateLocalStorage,
    globalBttv,
    globalFfz,
    lastGlobalEmoteUpdate,
    updateGlobalEmotes,
    updateTabEmotes,
    updateTabBadges,
    updateGlobalBadges,
    globalBadges,
  } = useContext(TabsContext);
  const { options } = useContext(OptionsContext);
  const authContext = useContext(AuthContext);
  const [channel, setChannel] = useState(
    window.location.hash.replace("#/chat/", "")
  );
  const [loginRedirect, setLoginRedirect] = useState(false);
  const tab = tabs.find((t) => t.name === channel);
  let isPaused = useRef(false);
  let isConnected = false;
  let showDate = false;
  let messageLimit = useRef(options?.chat?.messages?.limit);
  let smoothScroll = useRef(options?.chat?.smoothScroll);
  let loadedEmotes = useRef(false);

  const client = tmi.client({
    channels: [tab?.id === 0 ? channel.replace("Sync_", "") : channel],
    options: {
      clientId: CLIENT_ID,
      debug: false,
    },
    identity:
      authContext?.authUser?.username && authContext?.authUser?.username !== ""
        ? {
            username: authContext.authUser.username,
            password: authContext.authUser.token,
          }
        : null,
    connection: { reconnect: false },
  });

  client.on("connected", () => {
    console.log("Connected");
    isConnected = true;
  });

  client.on("message", (channel, userState, message, self) => {
    const container = document.getElementById("messages-container");
    // Make sure the visible messages does not exceed the limit
    while (container.childNodes.length >= messageLimit.current) {
      const firstChild = container.firstChild;
      if (firstChild !== null) firstChild.remove();
    }
    // Make sure the visible messages does not exceed the limit
    while (tab?.messages.length >= messageLimit.current) {
      tab.messages.shift();
    }

    //#region Emotes

    let emotesObj = userState.emotes;
    if (emotesObj) {
      message = insertEmotes(message, emotesObj);
    }

    globalBttv?.forEach((x) => {
      const regex = new RegExp(`\\b${x.code}\\b`, "g");
      const match = message.match(regex);
      if (match !== null && match.length > 0) {
        message = insertBttvEmote(message, x.code, x.id);
      }
    });

    tab?.bttv?.sharedEmotes?.forEach((x) => {
      const regex = new RegExp(`\\b${x.code}\\b`, "g");
      const match = message.match(regex);
      if (match !== null && match.length > 0) {
        message = insertBttvEmote(message, x.code, x.id);
      }
    });

    globalFfz?.forEach((x) => {
      const regex = new RegExp(`\\b${x.name}\\b`, "g");
      const match = message.match(regex);
      if (match !== null && match.length > 0) {
        message = insertFfzEmote(message, x.name, x.id);
      }
    });

    tab?.ffz?.forEach((x) => {
      const regex = new RegExp(`\\b${x.name}\\b`, "g");
      const match = message.match(regex);
      if (match !== null && match.length > 0) {
        message = insertFfzEmote(message, x.name, x.id);
      }
    });

    //#endregion Emotes

    const msg = constructMessage(message, userState);

    tab.messages.push(msg);

    let msgEl = document.createElement("p");
    msgEl.innerHTML = msg;
    msgEl.classList.add("message");
    if (userState["message-type"] === "action") {
      msgEl.style.color = userState.color;
    }

    msgEl.addEventListener("click", insertReply);

    container.append(msgEl);
    scrollToBottom();
    updateLocalStorage(tabs);
  });

  const constructMessage = (message, userState) => {
    const date = new Date();

    let badges = "";
    if (userState?.badges) {
      Object.keys(userState.badges).forEach((key) => {
        const keyTitle =
          key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase();
        if (key === "subscriber") {
          if (tab.badges) {
            const cBadge = tab?.badges[userState?.badges[key]]?.image_url_1x;
            if (cBadge) {
              badges += `<span class="tooltip tooltip-right" data-text="${keyTitle}" ><img src="${cBadge}" alt="${keyTitle}" /></span>`;
              return;
            }
          }
          badges += `<span class="tooltip tooltip-right" data-text="${keyTitle}" ><img src="${globalBadges[key]?.versions[0]?.image_url_1x}" alt="${keyTitle}" /></span>`;
          return;
        }
        const gBadge =
          globalBadges[key]?.versions[userState.badges[key]]?.image_url_1x;
        if (gBadge) {
          badges += `<span class="tooltip tooltip-right" data-text="${keyTitle}" ><img src="${gBadge}" alt="${keyTitle}" /></span>`;
          return;
        }
      });
    }

    const mentionRegex = new RegExp(`\\B@[\\S]{1,}\\b`, "gi");
    const matches = message.match(mentionRegex);
    if (matches !== null && matches.length > 0) {
      matches.forEach((match) => {
        message = insertMention(message, match);
      });
    }

    const htmlMsg = `${
      showDate ? date.getHours() + ":" + date.getMinutes() + " " : ""
    }${badges}<span style="color: ${
      userState.color ?? "#1c82e7"
    }; font-weight: bold; word-wrap: none;" class="message-username" >${
      userState.username
    }</span>${
      userState["message-type"] === "action" ? "&nbsp;" : "<span>:&nbsp;</span>"
    }${message}`;

    return htmlMsg;
  };

  const insertMention = (message, match) => {
    if (message === "" || !match) return;
    const stringReplacements = [];
    const start = message.indexOf(match);
    const end = start + match.length;
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `${
        start === 0 ? "" : "&nbsp;"
      }<b class="message-mention" data-username="${match.replace(
        "@",
        ""
      )}" >${stringToReplace}</b>${end === message.length ? "" : "&nbsp;"}`,
    });
    const messageHTML = stringReplacements.reduce(
      (acc, { stringToReplace, replacement }) => {
        return acc.split(stringToReplace).join(replacement);
      },
      message
    );
    return messageHTML;
  };

  const insertBttvEmote = (message, code, id) => {
    if (message === "" || !code) return;
    const stringReplacements = [];
    const start = message.indexOf(code);
    const end = start + code.length;
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<span class="tooltip tooltip-top" data-text="${stringToReplace}"><img src="https://cdn.betterttv.net/emote/${id}/1x" alt="${stringToReplace}" /></span>`,
    });
    const messageHTML = stringReplacements.reduce(
      (acc, { stringToReplace, replacement }) => {
        return acc.split(stringToReplace).join(replacement);
      },
      message
    );
    return messageHTML;
  };

  const insertFfzEmote = (message, code, id) => {
    if (message === "" || !code) return;
    const stringReplacements = [];
    const start = message.indexOf(code);
    const end = start + code.length;
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<span class="tooltip tooltip-top" data-text="${stringToReplace}"><img src="https://cdn.frankerfacez.com/emote/${id}/1" alt="${stringToReplace}" /></span>`,
    });
    const messageHTML = stringReplacements.reduce(
      (acc, { stringToReplace, replacement }) => {
        return acc.split(stringToReplace).join(replacement);
      },
      message
    );
    return messageHTML;
  };

  const insertEmotes = (message, emotesObject) => {
    if (message === "" || !emotesObject) return;
    const stringReplacements = [];
    Object.entries(emotesObject).forEach(([id, positions]) => {
      const position = positions[0];
      const [start, end] = position.split("-");
      const stringToReplace = message.substring(
        parseInt(start, 10),
        parseInt(end, 10) + 1
      );

      stringReplacements.push({
        stringToReplace: stringToReplace,
        replacement: `<span class="tooltip tooltip-top" data-text="${stringToReplace}"><img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0" alt="${stringToReplace}" class="tooltip tooltip-bottom" data-text="${stringToReplace}" /></span>`,
      });
    });
    const messageHTML = stringReplacements.reduce(
      (acc, { stringToReplace, replacement }) => {
        return acc.split(stringToReplace).join(replacement);
      },
      message
    );
    return messageHTML;
  };

  const scrollToBottom = useCallback(
    (ignorePause = false, smooth = smoothScroll.current) => {
      if (!isPaused.current || ignorePause) {
        window.scrollTo({
          behavior: smooth ? "smooth" : "auto",
          top: document.body.scrollHeight,
          left: 0,
        });
      }
    },
    [isPaused, smoothScroll]
  );

  const scrollToTop = (e, smooth = smoothScroll.current) => {
    if (isPaused.current) {
      window.scrollTo({
        behavior: smooth ? "smooth" : "auto",
        top: 0,
        left: 0,
      });
    }
  };

  const unPause = useCallback(() => {
    scrollToBottom(true);
    isPaused.current = false;
    const el = document.getElementById("paused");
    if (el) {
      isPaused.current = false;
      el.style.display = "none";
    }
  }, [isPaused, scrollToBottom]);

  const pause = useCallback(() => {
    const el = document.getElementById("paused");
    if (el) {
      isPaused.current = true;
      el.style.display = "block";
    }
  }, [isPaused]);

  const handleScrollPause = useCallback(
    (e) => {
      if (
        e.target.classList.contains("navbar-container") ||
        e.target.classList.contains("navbar-link") ||
        e.target.classList.contains("navbar-link-i")
      ) {
        return;
      } else if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight
      ) {
        unPause();
      } else if (e.deltaY < 0) {
        pause();
      }
    },
    [pause, unPause]
  );

  const handleKeydownPause = useCallback(
    (e) => {
      if (e.key === "Alt" && !isPaused.current) {
        e.preventDefault();
        pause();
      }
    },
    [isPaused, pause]
  );

  const handleKeyupPause = useCallback(
    (e) => {
      if (e.key === "Alt" && isPaused.current) {
        e.preventDefault();
        unPause();
      }
    },
    [isPaused, unPause]
  );

  const remove = () => {
    removeTab(channel);
    setChannel("");
  };

  const sendMessage = (e) => {
    const messageEl = document.getElementById("message");
    const message = messageEl.value;
    if (message.trim() !== "") {
      let c = channel;
      if (tab?.id === 0) c = channel.replace("Sync_", "");
      client
        .say(c, message)
        .then()
        .catch((err) => console.log(err));
    }
    messageEl.value = "";
  };

  const handleSend = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const insertReply = (e) => {
    if (e.target.classList.contains("message-username")) {
      const input = document.getElementById("message");
      input.value += "@" + e.target.innerText + " ";
      input.focus();
    } else if (e.target.classList.contains("message-mention")) {
      const input = document.getElementById("message");
      input.value += e.target.innerText + " ";
      input.focus();
    }
  };

  const setPadding = () => {
    document.getElementById("messages-container").style.paddingBottom =
      document.getElementById("message").getBoundingClientRect().height + "px";
    scrollToBottom();
  };

  useEffect(() => {
    if (!loadedEmotes.current) {
      const date = new Date(Date.now());
      if (lastGlobalEmoteUpdate <= date.setMinutes(date.getMinutes() - 5)) {
        console.info("Updating global emotes.");
        updateGlobalEmotes();
        updateGlobalBadges();
      }

      if (tab.lastEmoteUpdate <= date.setMinutes(date.getMinutes() - 5)) {
        // Get twitch id
        let c = channel;
        if (tab?.id === 0) c = channel.replace("Sync_", "");
        fetch(`https://api.frankerfacez.com/v1/user/${c.toLowerCase()}`)
          .then((res) => res.json())
          .then((res) => {
            const { user } = res;
            console.info("Updating channel emotes.");
            updateTabEmotes(user?.twitch_id ?? 0, tab.id);
            updateTabBadges(user?.twitch_id ?? 0, tab.id);
          });
      }

      const container = document.getElementById("messages-container");
      while (container.childNodes.length > messageLimit.current) {
        const firstChild = container.firstChild;
        if (firstChild !== null) firstChild.remove();
      }
      // Make sure the visible messages does not exceed the limit
      while (tab?.messages.length > messageLimit.current) {
        tab.messages.shift();
      }

      loadedEmotes.current = true;
    }

    messageLimit.current = options?.chat?.messages?.limit;
    smoothScroll.current = options?.chat?.smoothScroll;

    if (!isConnected && client.readyState() !== "CONNECTING") {
      client.connect();
      document.addEventListener("wheel", handleScrollPause);
      document.addEventListener("keydown", handleKeydownPause);
      document.addEventListener("keyup", handleKeyupPause);
      document.querySelectorAll(".message").forEach((el) => {
        el.removeEventListener("click", insertReply);
      });
      scrollToBottom();
      document.querySelectorAll(".message").forEach((el) => {
        el.addEventListener("click", insertReply);
      });
    }
    return () => {
      if (isConnected) {
        client.disconnect();
      }
      document.removeEventListener("wheel", handleScrollPause, true);
      document.removeEventListener("keydown", handleKeydownPause, true);
      document.removeEventListener("keyup", handleKeyupPause, true);
      document.querySelectorAll(".message").forEach((el) => {
        el.removeEventListener("click", insertReply);
      });
      client.removeAllListeners();
    };
  }, [
    isConnected,
    client,
    handleScrollPause,
    handleKeydownPause,
    handleKeyupPause,
    scrollToBottom,
    channel,
    messageLimit,
    smoothScroll,
    options,
    loadedEmotes,
    tab.messages,
    tab.id,
    tab.lastEmoteUpdate,
    globalBttv,
    globalFfz,
    lastGlobalEmoteUpdate,
    updateGlobalEmotes,
    updateTabEmotes,
    updateTabBadges,
    updateGlobalBadges,
  ]);

  if (channel === "" || tab === null) return <Redirect to="/" />;
  if (loginRedirect) return <Redirect to="/options/login" />;
  return (
    <>
      <h1 className="channel-title">{channel}</h1>
      <p className="channel-tip">
        Click the active tab for additional actions.
      </p>
      {tab.id === 0 ? (
        <p className="channel-tip">
          Navigate to a channel in your browser to sync. <br />
          Make sure you have the extension installed and enabled.
        </p>
      ) : null}
      <button onClick={remove} className="channel-remove-btn">
        Remove channel
      </button>
      <div id="messages-container" style={{ paddingBottom: "40px" }}>
        {tab?.messages?.map((m, i) => {
          return (
            <p key={i} className="message">
              {parse(m)}
            </p>
          );
        })}
      </div>
      <div className="messages-chat-container">
        <input
          className="message-input"
          type="text"
          id="message"
          disabled={
            authContext?.authUser?.username &&
            authContext?.authUser?.username !== ""
              ? false
              : true
          }
          onKeyPress={handleSend}
          onKeyDown={setPadding}
          onKeyUp={setPadding}
          placeholder={
            authContext?.authUser?.username &&
            authContext?.authUser?.username !== ""
              ? "Send a message"
              : "Please login to send a message"
          }
        />
        {authContext?.authUser?.username &&
        authContext?.authUser?.username !== "" ? (
          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>
        ) : (
          <button
            className="send-btn disabled"
            onClick={() => setLoginRedirect(true)}
          >
            Login
          </button>
        )}
      </div>
      <div id="paused">
        <button className="paused-btn" onClick={unPause}>
          Chat Paused
        </button>
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>
    </>
  );
};

export default Channel;
