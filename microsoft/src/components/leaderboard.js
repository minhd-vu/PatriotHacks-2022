import React from "react";
import Map from "./map";
import EntryForm from "./entry/entry.form";

export default function Leaderboard() {
    return (
        <React.Fragment>
            <h3>Danger Zones</h3>
            <EntryForm />
            <br />
            <Map />
            <br />
        </React.Fragment>
    );
}