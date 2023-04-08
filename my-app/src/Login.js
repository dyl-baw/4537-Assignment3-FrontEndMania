import React, { useState } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard';
// require("dotenv").config();



function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:8080/login", { username, password });
        setUser(res.data.user);
        console.log(res.headers);
        const auth = res.headers['authorization'];
        const accessParsed = auth.split(' ')[1];
        const refreshParsed = auth.split(' ')[3];
        setAccessToken(accessParsed);
        setRefreshToken(refreshParsed);
        console.log("here"+auth)
    } catch (err) {
        console.log(err);
    }
}

  return (
    <div>
      {user?.username ? (
        <>
          <h1>Welcome {user.username}</h1>
          <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <span> Admin Login </span>
          <br />
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" value="submit">
            Login
          </button>
        </form>
      )}
    </div>
  )
}

export default Login