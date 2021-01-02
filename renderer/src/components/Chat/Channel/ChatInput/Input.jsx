import React, { useEffect } from "react";

const Input = ({
  authUser,
  handleSend,
  setPadding,
  sendMessage,
  setLoginRedirect,
  isReady,
  roomState,
  connectionError,
}) => {
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

  if (!isReady && !connectionError)
    return (
      <>
        <input
          className="message-input"
          type="text"
          id="message"
          onKeyPress={handleSend}
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
          onKeyPress={handleSend}
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
        <input
          className="message-input"
          type="text"
          id="message"
          onKeyPress={handleSend}
          placeholder="Send a message"
        />
        <button className="send-btn" onClick={sendMessage}>
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
