import React, { useEffect, useState } from "react";
import axios from "axios";
import Statistics from "./statistics";
import Map from "./map";
import EntryForm from "./entry/entry.form";

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});

    return (
        <React.Fragment>
            <h3>Danger Zones</h3>
            <EntryForm />
            <Statistics {...stats} />
            <br />
            <Map />
            <br />
        </React.Fragment>
    );
}