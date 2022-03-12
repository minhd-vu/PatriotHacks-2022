import React, { useEffect, useState } from "react";
import axios from "axios";
import Statistics from "./statistics";
import Map from "./map";

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});

    return (
        <React.Fragment>
            <Statistics {...stats} />
            <br />
            <Map />
            <br />
        </React.Fragment>
    );
}