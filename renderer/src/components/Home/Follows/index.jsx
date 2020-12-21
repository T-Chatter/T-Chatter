import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { CLIENT_ID } from "../../../constants";
import "./style.css";

function stringToBoolean(string) {
  switch (string.toLowerCase().trim()) {
    case true:
    case "true":
    case 1:
    case "1":
    case "on":
    case "yes":
      return true;
    default:
      return false;
  }
}

const Follows = ({ addTab }) => {
  const authContext = useContext(AuthContext);
  const [isLoadingFollows, setIsLoadingFollows] = useState(true);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const [isNotFollowingAnyone, setIsNotFollowingAnyone] = useState(false);
  const [liveChannels, setLiveChannels] = useState([]);
  const [followedChannels, setFollowedChannels] = useState([]);

  const add = useCallback(
    (e) => {
      addTab(e.target.id);
    },
    [addTab]
  );

  const refreshFollows = useCallback(
    (e) => {
      setIsLoadingFollows(true);
      authContext.update(authContext?.authUser?.token);
    },
    [authContext]
  );

  const mapFollowedChannels = useCallback(() => {
    let elements = [];
    authContext?.authUser?.follows.forEach((follow) => {
      let foundMatch = false;
      let views = 0;
      liveChannels.forEach((val) => {
        if (val.user_name === follow.to_name) {
          foundMatch = true;
          views = val.viewer_count;
        }
      });
      if (foundMatch)
        elements.push(
          <h4
            key={follow.to_name}
            name={follow.to_name}
            live="true"
            viewer_count={follow.viewer_count}
          >
            <button
              id={follow.to_name}
              onClick={add}
              className="follows-btn add-btn"
            >
              Add
            </button>
            {follow.to_name} ({views})
          </h4>
        );
      else
        elements.push(
          <h4
            key={follow.to_name}
            name={follow.to_name}
            live="false"
            viewer_count={views}
          >
            <button
              id={follow.to_name}
              onClick={add}
              className="follows-btn add-btn"
            >
              Add
            </button>
            {follow.to_name}
          </h4>
        );
    });

    elements = elements
      .sort(
        (x, y) => stringToBoolean(x.props.live) - stringToBoolean(y.props.live)
      )
      .reverse();
    elements = elements.sort(
      (x, y) => x.props.viewer_count > y.props.viewer_count
    );
    return elements;
  }, [authContext, liveChannels, add]);

  const fetchFollows = useCallback(() => {
    if (
      authContext?.authUser?.follows !== null &&
      authContext?.authUser?.follows?.length > 0
    ) {
      let ids = [];
      authContext.authUser.follows.forEach((follow) => ids.push(follow.to_id));
      fetch(
        "https://api.twitch.tv/helix/streams?user_id=" + ids.join("&user_id="),
        {
          headers: {
            Authorization: "Bearer " + authContext?.authUser?.token,
            "Client-Id": CLIENT_ID,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setLiveChannels(res.data);
          setFollowedChannels(mapFollowedChannels());
          setIsLoadingFollows(false);
        })
        .catch((res) => {
          setIsNotLoggedIn(true);
          setIsLoadingFollows(false);
        });
    } else if (authContext?.authUser?.token !== null) {
      setIsNotFollowingAnyone(true);
      setIsNotLoggedIn(false);
      setIsLoadingFollows(false);
    } else {
      setIsNotLoggedIn(true);
      setIsLoadingFollows(false);
    }
  }, [authContext, mapFollowedChannels]);

  useEffect(() => {
    if (!authContext.isLoading && isLoadingFollows) {
      fetchFollows();
    }
    const interval = setInterval(() => {
      refreshFollows();
    }, 5 * 1000 * 60);
    return () => clearInterval(interval);
  }, [fetchFollows, isLoadingFollows, authContext, refreshFollows]);

  if (isLoadingFollows) return <h1>Loading...</h1>;
  if (isNotLoggedIn)
    return (
      <>
        <h4 className="follows-title-2">Login to see your followed streams.</h4>
        <Link to="/options/login" className="follows-btn login-btn">
          Login
        </Link>
      </>
    );
  if (isNotFollowingAnyone)
    return (
      <h4 className="follows-title follows-title-2">
        You do not follow any channels
        <button
          onClick={refreshFollows}
          className="follows-btn refresh-btn tooltip tooltip-top"
          data-text="Refresh"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </h4>
    );
  return (
    <div>
      <h1 className="follows-title">
        Followed Channels
        <button
          onClick={refreshFollows}
          className="follows-btn refresh-btn tooltip tooltip-top"
          data-text="Refresh"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </h1>
      <small className="follows-wip">
        <i>WIP. Will only shows a limited amout of followed channels...</i>
      </small>
      <div className="follows-container">
        <div>{followedChannels}</div>
      </div>
    </div>
  );
};

export default Follows;
