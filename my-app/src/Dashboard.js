import Search from "./Search";
// import Result from "./Result";
import React from 'react'
import Report from './Report';

import {
  Routes,
  Route,
  Link
} from "react-router-dom";

function Dashboard({ user, setUser, accessToken, setAccessToken, refreshToken }) {
  return (
    <>{
        user?.role === 'admin' ? (
            <div>
                <h1>
                    Dashboard
                </h1>


                <div>
                        <h2>Report 1 - Unique API users over a period of time</h2>
                        <Report id={1} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
                    </div>
                    <div>
                        <h2>Report 2 - Top API users over period of time</h2>
                        <Report id={2} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
                    </div>
                    <div>
                        <h2>Report 3 - Top users for each Endpoint</h2>
                        <Report id={3} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
                    </div>
                    <div>
                        <h2>Report 4 - 4xx Errors By Endpoint</h2>
                        <Report id={4} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
                    </div>
                    <div>
                        <h2>Report 5 - Recent 4xx/5xx Errors</h2>
                        <Report id={5} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
                    </div>

                {/* <nav>
                    <ul>
                        <li><Link to="/report/1">Report 1 - Unique API users over a period of time</Link></li>
                        <li><Link to="/report/2">Report 2 - Top API users over period of time</Link></li>
                        <li><Link to="/report/3">Report 3 - Top users for each Endpoint</Link></li>
                    </ul>
                </nav> */}
            </div>)
            : null}
    </>
  )
}
export default Dashboard