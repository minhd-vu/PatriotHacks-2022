import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { UserContext } from "../contexts/user.context";
import EntryForm from "./entry/entry.form";

export default function Profile(props) {
    const user = useContext(UserContext);
    const [username, setUsername] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        let username = props.match?.params?.username || user.username;
        setUsername(username);

        axios.get("/api/user/" + username, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    setError(false);
                } else if (res.status === 204) {
                    setError(true);
                }
            })
            .catch(err => console.log(err));
    }, [username, props, user.username]);

    return (
        <React.Fragment>
            <h3>{username}'s Profile</h3>
            {
                user.username === username && <EntryForm />
            }
            {
                error && <Alert key="danger" variant="danger">No user found with username <b>{username}</b>.</Alert>
            }
        </React.Fragment>
    );
}