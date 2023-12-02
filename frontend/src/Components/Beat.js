import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Beat = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [editBeat, setEditbeat] = useState(false);
  const [newcontent, setNewcontent] = useState(props.content);
  // console.log(props);
  useEffect(() => {
    axios.get("http://localhost:3001/getuser").then((res) => {
      if (res.data.status === "pass") {
        setUsername(res.data.name);
      } else {
        console.log(res.data.message);
      }
    });
  }, []);

  function handleDeletebeat() {
    const beat_id = props.id;
    if (username) {
      axios
        .delete(`http://localhost:3001/deletebeat/${beat_id}`)
        .then((res) => {
          if (res.data.status === "pass") {
            console.log("delete success");
          } else {
            console.log(res.data.message);
          }
        });
      props.onDeletebeat(beat_id);
    }
  }

  function showUpdatebox() {
    setEditbeat(true);
  }

  function handleUpdatebeat() {
    if (username) {
      axios
        .put(`http://localhost:3001/updatebeat`, {
          content: newcontent,
          id: props.id,
        })
        .then((res) => {
          if (res.data.status === "pass") {
            // console.log("beat updated");

            setEditbeat(false);
          } else {
            console.log(res.data.message);
          }
        });
    }
  }

  function handleNavProfile() {
    // console.log("click");
    navigate(`/${props.name}`);
  }
  return (
    <div className="beat">
      <div className="beat-head">
        <div className="beat-profile-pic">
          <img src="https://pbs.twimg.com/profile_images/529921298533605376/Axg3L134_400x400.png"></img>
        </div>
        <div className="beat-profile-info">
          <div className="name" onClick={handleNavProfile}>
            @{props.name}
          </div>
          <div className="info">posted on: {props.date}</div>
        </div>
      </div>
      {editBeat ? (
        <div className="beat-body">
          <input
            onChange={(e) => setNewcontent(e.target.value)}
            placeholder="write updated beat !!"
          ></input>
        </div>
      ) : (
        <div className="beat-body">{newcontent}</div>
      )}
      <div className="beat-foot">
        {props.likes} ❤️
        {username === props.name && (
          <>
            <div className="update-delete-beat">
              {editBeat ? (
                <div onClick={handleUpdatebeat}>✅save</div>
              ) : (
                <>
                  <div onClick={showUpdatebox}>✍🏻update</div>
                  <div onClick={handleDeletebeat}>🗑️delete</div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Beat;
