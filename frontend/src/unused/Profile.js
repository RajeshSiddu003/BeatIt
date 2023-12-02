import React, { useState, useEffect } from "react";
import Beat from "../Components/Beat";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // const { username } = useParams();
  const [content, setContent] = useState("");
  const [user, setUser] = useState("");
  const [beats, setBeats] = useState([]);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3001/getuser")
      .then((res) => {
        if (res.data.status === "pass") {
          setUser(res.data.name);
        } else {
          console.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:3001/getbeats", {
          name: user,
        })
        .then((res) => {
          if (res.data.status === "pass") {
            setBeats(res.data.beats);
          } else {
            console.error(res.data.message);
          }
        });

      axios
        .post("http://localhost:3001/getbeatscount", {
          name: user,
        })
        .then((res) => {
          if (res.data.status === "pass") {
            setCount(res.data.count);
          } else {
            console.error(res.data.message);
          }
        });
    }
  }, [user]);

  const handleAddbeat = (e) => {
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
    e.preventDefault();
    axios
      .post("http://localhost:3001/addbeat", {
        name: user,
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
    setCount(count + 1);
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

  return (
    <>
      {user ? (
        <div className="container">
          <div className="profile">
            <img src="https://pbs.twimg.com/profile_images/529921298533605376/Axg3L134_400x400.png"></img>
            <div className="profile-info">
              <div className="name">@{user}</div>
              <div className="info">Beats: {count}</div>
            </div>
          </div>
          <form className="add-beat">
            <input
              placeholder="add a new beat !!!"
              onChange={(e) => setContent(e.target.value)}
            ></input>
            <button type="submit" onClick={handleAddbeat}>
              <i>Beat it !</i>
            </button>
          </form>
          <div className="profile-nav">
            <div>My beats</div>
            <button onClick={handlelogout}>Log out</button>
          </div>
          <div className="beat-container">
            {beats.map((beat, index) => {
              return (
                <Beat
                  key={index}
                  content={beat.content}
                  name={beat.name}
                  likes={beat.likes}
                  date={beat.date}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h1>auth error</h1>
      )}
    </>
  );
};

export default Profile;
