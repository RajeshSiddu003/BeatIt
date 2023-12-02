import React, { useEffect, useState } from "react";
import axios from "axios";
import Beat from "../Components/Beat";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useParams();
  const [username, setUsername] = useState("");
  const [beats, setBeats] = useState([]);
  const [content, setContent] = useState("");
  const [addbeaterr, setAddbeaterr] = useState("");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3001/getuser").then((res) => {
      if (res.data.status === "pass") {
        setUsername(res.data.name);
      } else {
        console.log(res.data.message);
      }
    });

    axios
      .post("http://localhost:3001/getbeats", {
        name: user,
      })
      .then((res) => {
        if (res.data.status === "pass") {
          setBeats(res.data.beats);
        } else {
          console.log(res.data.message);
        }
      });
  }, []);

  const handleAddbeat = (e) => {
    e.preventDefault();
    if (username) {
      if (content == "") {
        setAddbeaterr("Please write something");
      } else {
        setAddbeaterr("");
        var currentdate = new Date();
        var datetime =
          currentdate.getDate() +
          "/" +
          (currentdate.getMonth() + 1) +
          "/" +
          currentdate.getFullYear() +
          " @ " +
          currentdate.getHours() +
          ":" +
          currentdate.getMinutes();
        axios
          .post("http://localhost:3001/addbeat", {
            name: username,
            content: content,
            likes: 0,
            date: datetime,
          })
          .then((res) => {
            if (res.data.status === "pass") {
              console.log("beat added");
            } else {
              console.log(res.data.message);
            }
          });
        setBeats([
          {
            name: user,
            content: content,
            likes: 0,
            date: datetime,
          },
          ...beats,
        ]);
      }
    }
  };

  const handlelogout = () => {
    axios.get("http://localhost:3001/logout").then((res) => {
      if (res.data.status === "pass") {
        navigate("/login");
      } else {
        console.log("log out failed");
      }
    });
  };

  const handlegotohome = () => {
    navigate("/");
  };

  function handleDeletebeat(beat_id) {
    // console.log(`${beat_id} deleted`);
    setBeats(beats.filter((beat) => beat.id !== beat_id));
  }

  return (
    <div>
      <div className="container">
        <div className="profile">
          <img src="https://pbs.twimg.com/profile_images/529921298533605376/Axg3L134_400x400.png"></img>
          <div className="profile-info">
            <div className="name">@{user}</div>
            <div className="info">Beats: {beats.length}</div>
          </div>
        </div>
        {user === username ? (
          <>
            <form className="add-beat">
              <input
                placeholder="add a new beat !!!"
                onChange={(e) => setContent(e.target.value)}
              ></input>
              <button type="submit" onClick={handleAddbeat}>
                <i>Beat it !</i>
              </button>
            </form>
            {addbeaterr && (
              <div className="addbeaterror">
                <i>{addbeaterr}</i>
              </div>
            )}
            <div className="profile-nav">
              <div>My beats</div>
              <button onClick={handlegotohome} className="gotohome">
                Go to home
              </button>
              <button onClick={handlelogout}>Log out</button>
            </div>
          </>
        ) : (
          <div className="profile-nav">
            <button onClick={handlegotohome} className="gotohome">
              Go to home
            </button>
          </div>
        )}
        <div className="beat-container">
          {beats.map((beat) => {
            return (
              <Beat
                key={beat.id}
                id={beat.id}
                content={beat.content}
                name={beat.name}
                likes={beat.likes}
                date={beat.date}
                onDeletebeat={handleDeletebeat}
                // onUpdatebeat={handleUpdatebeat}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
