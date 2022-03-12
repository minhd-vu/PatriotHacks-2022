import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Statistics(props) {
    const [locations, setLocations] = useState("");

    useEffect(() => {
        axios.get("/api/entry", { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    // console.log(res.data);
                    const locations = [];
                    res.data.forEach(e => locations.push(e.location));
                    setLocations([...new Set(locations)]);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div className="row">
        </div>
    );
}