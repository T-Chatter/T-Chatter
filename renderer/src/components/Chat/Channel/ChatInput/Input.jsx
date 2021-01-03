import React, { useContext, useEffect, useState } from "react";
import { TabsContext } from "../../../../contexts/Tabs/tabs.context";
import "./Input.css";

const Input = ({
  authUser,
  handleSend,
  setPadding,
  sendMessage,
  setLoginRedirect,
  isReady,
  roomState,
  connectionError,
  tab,
  insertEmote,
}) => {
  const tabsContext = useContext(TabsContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggleEmoteMenu = (e, close = false) => {
    if (close) setIsOpen(false);
    else setIsOpen(!isOpen);
  };

  const State = () => {
    const css = {
      position: "absolute",
      bottom: "38px",
      left: "0",
      backgroundColor: "#121013",
      border: "#a16bf5 2px solid",
      width: "100%",
      padding: "5px",
    };

    const pCss = {
      margin: "0",
    };

    let stateElements = [];
    if (
      roomState["emote-only"] !== false &&
      roomState["emote-only"] !== undefined &&
      roomState["emote-only"] !== "-1"
    ) {
      stateElements.push(
        <p style={pCss} key="emote-only">
          Emote Only
        </p>
      );
    }
    if (
      roomState["followers-only"] !== false &&
      roomState["followers-only"] !== undefined &&
      roomState["followers-only"] !== "-1"
    ) {
      let duration = roomState["followers-only"];
      duration =
        duration > 60 ? duration / 60 + " hour(s)" : duration + " minute(s)";
      stateElements.push(
        <p style={pCss} key="followers-only">
          Followers Only {duration}
        </p>
      );
    }
    if (
      roomState["r9k"] !== false &&
      roomState["r9k"] !== undefined &&
      roomState["r9k"] !== "-1"
    )
      stateElements.push(
        <p style={pCss} key="R9K">
          R9K Mode
        </p>
      );
    if (
      roomState["slow"] !== false &&
      roomState["slow"] !== undefined &&
      roomState["slow"] !== "-1"
    ) {
      let duration = roomState["slow"];
      duration =
        duration > 60 ? duration / 60 + " hour(s)" : duration + " minute(s)";
      stateElements.push(
        <p style={pCss} key="slow">
          Slow Mode {duration}
        </p>
      );
    }
    if (
      roomState["subs-only"] !== false &&
      roomState["subs-only"] !== undefined &&
      roomState["subs-only"] !== "-1"
    ) {
      stateElements.push(
        <p style={pCss} key="subs-only">
          Subscriber Only
        </p>
      );
    }

    useEffect(() => {
      if (stateElements.length > 0) {
        console.log(stateElements.length * 19 + 10 + 2 + 40);
        setPadding(stateElements.length * 19 + 10 + 2 + 40);
      }
    }, [stateElements.length]);

    if (stateElements.length > 0)
      return (
        <div id="room-state" style={css}>
          {stateElements.map((el, index) => el)}
        </div>
      );
    else return null;
  };

  const Emote = ({ id, code, bttv = false, ffz = false }) => {
    if (!id) return null;
    else if (bttv)
      return (
        <span
          className="emote-menu-emote"
          data-code={code}
          onClick={(e) => insertEmote(e, code)}
          title={code}
        >
          <img src={`https://cdn.betterttv.net/emote/${id}/1x`} alt={code} />
        </span>
      );
    else if (ffz)
      return (
        <span
          className="emote-menu-emote"
          data-code={code}
          onClick={(e) => insertEmote(e, code)}
          title={code}
        >
          <img src={`https://cdn.frankerfacez.com/emote/${id}/1`} alt={code} />
        </span>
      );
    else return null;
  };

  const EmoteMenu = () => {
    const filterEmotes = (e) => {
      const query = e.target.value;
      const emotes = document.querySelectorAll(".emote-menu-emote");
      emotes.forEach((e) => {
        if (e.dataset.code.toLowerCase().includes(query.toLowerCase())) {
          e.classList.remove("hidden");
        } else {
          e.classList.add("hidden");
        }
      });
    };

    return (
      <>
        <div id="emote-menu" style={{ display: isOpen ? "flex" : "none" }}>
          {tabsContext?.globalBttv?.length > 0 ? <p>Global BTTV</p> : null}
          <div id="globalBTTV">
            {tabsContext?.globalBttv?.map((e) => {
              return <Emote key={e.id} id={e.id} code={e.code} bttv={true} />;
            })}
          </div>
          {tabsContext?.globalFfz?.length > 0 ? <p>Global FFZ</p> : null}
          <div id="globalFFZ">
            {tabsContext?.globalFfz?.map((e) => {
              return <Emote key={e.id} id={e.id} code={e.name} ffz={true} />;
            })}
          </div>
          {tab?.bttv?.sharedEmotes?.length > 0 ? <p>Channel BTTV</p> : null}
          <div id="channelBTTV">
            {tab?.bttv?.sharedEmotes?.map((e) => {
              return <Emote key={e.id} id={e.id} code={e.code} bttv={true} />;
            })}
          </div>
          {tab?.ffz?.length > 0 ? <p>Channel FFZ</p> : null}
          <div id="channelFFZ">
            {tab?.ffz?.map((e) => {
              return <Emote key={e.id} id={e.id} code={e.name} ffz={true} />;
            })}
          </div>
          <div className="emote-menu-search-container">
            <input
              className="emote-menu-search-input"
              placeholder="Seach emotes"
              type="text"
              onChange={filterEmotes}
            />
          </div>
        </div>
        <i className="far fa-smile emote-btn" onClick={toggleEmoteMenu}></i>
      </>
    );
  };

  if (!isReady && !connectionError)
    return (
      <>
        <input
          className="message-input"
          type="text"
          id="message"
          placeholder="Connecting..."
          disabled={true}
        />
        <button className="send-btn disabled">Connecting...</button>
      </>
    );
  else if (connectionError)
    return (
      <>
        <State />
        <input
          className="message-input"
          type="text"
          id="message"
          placeholder="Connection Error"
          disabled={true}
        />
        <button className="send-btn disabled">Error</button>
      </>
    );
  else if (authUser?.username && authUser?.username !== "" && isReady)
    return (
      <>
        <State />
        <div className="message-input-container">
          <input
            className="message-input"
            type="text"
            id="message"
            onKeyPress={handleSend}
            placeholder="Send a message"
          />
          <EmoteMenu />
        </div>
        <button
          className="send-btn"
          onClick={(e) => {
            sendMessage(e);
            toggleEmoteMenu(e, true);
          }}
        >
          Send
        </button>
      </>
    );
  else
    return (
      <>
        <State />
        <input
          className="message-input"
          type="text"
          id="message"
          disabled={true}
          onKeyPress={handleSend}
          placeholder="Please login to send a message"
        />
        <button
          className="send-btn disabled"
          onClick={() => setLoginRedirect(true)}
        >
          Login
        </button>
      </>
    );
};

export default Input;
