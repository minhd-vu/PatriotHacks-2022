import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { UserContext } from "../contexts/user.context";
import Web3 from "web3";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Profile(props) {
    const user = useContext(UserContext);
    const [eth, setEth] = useState("");
    const [profile, setProfile] = useState({});
    const [query, setQuery] = useState();
    const [form, setForm] = useState({
        editing: false,
        status: "safe",
    });


    async function onUpdateProfile(e) {
        e.preventDefault();
        const res = await axios.post("/api/user", {
            wallet: form.wallet,
            biography: form.biography,
            status: form.status
        }, { withCredentials: true });

        if (res.status === 200) {
            setProfile(res.data);
            setForm({ ...form, editing: false });
        }
    }

    function toggleForm(e) {
        e.preventDefault();
        setForm({ ...form, editing: true })
    }

    useEffect(() => {
        let username = props.match?.params?.username || user.username;

        axios.get("/api/user/" + username, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setProfile(res.data);
                } else if (res.status === 204) {
                    setProfile(p => ({ ...p, error: `No user found with username ${username}` }));
                    axios.post("/api/user/search", { query: username }, { withCredentials: true }).then(res => {
                        if (res.status === 200) {
                            console.log(res.data);
                            setQuery(res.data.map(e =>
                                <li className="list-group-item" key={e.username}>
                                    <Row >
                                        <Col md={2}>Username: {e.username}</Col>
                                        <Col md={2}>Name: {e.name}</Col>
                                        <Col md={2}>{
                                            e.status === "safe" ?
                                                <span className="badge badge-success mx-2">Safe</span> :
                                                <span className="badge badge-danger mx-2">Unsafe</span>
                                        }</Col>
                                    </Row>
                                    <Row>
                                        <Col>Biography: {e.biography}</Col>
                                    </Row>
                                </li>
                            ));
                        }
                    })
                }
            })
            .catch(err => console.log(err));
    }, [props, user.username]);

    async function onSubmit(e) {
        e.preventDefault();

        if (!window.ethereum) {
            return console.log("Install Metamask.");
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const res = await web3.eth.sendTransaction({
            from: accounts[0],
            to: user.wallet,
            value: web3.utils.toWei(eth, "ether"),
        });

        console.log(res);
    }

    async function addContact(e) {
        e.preventDefault()
        try {
            const res = await axios.get("/api/chat/find/" + user.username + "/" + profile.username)
            console.log(res)
            if (res.data === null) {
                await axios.post("/api/chat", {
                    "senderId": user.username,
                    "receiverId": profile.username
                })
            }
            props.history.push('/chat')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        profile.error ?
            <React.Fragment>
                <Alert key="danger" variant="danger">{profile.error}</Alert>
                <h5>Similar Results:</h5>
                <ul className="list-group">
                    {query}
                </ul>
            </React.Fragment> :
            <React.Fragment>
                <h3>{profile.username}'s Profile
                    {
                        profile.status === "safe" ?
                            <span className="badge badge-success mx-2">Safe</span> :
                            <span className="badge badge-danger mx-2">Unsafe</span>
                    }
                </h3>
                <h5>ETH Wallet Address: {profile.wallet}</h5>
                {
                    profile.username !== user.username &&
                    <React.Fragment>
                        <form className="form-inline" onSubmit={onSubmit}>
                            <div className="form-group">
                                <input
                                    type="number"
                                    required
                                    className="form-control"
                                    value={eth}
                                    placeholder="ETH Amount"
                                    onChange={e => setEth(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="submit"
                                    value="Send Donation"
                                    className="btn btn-primary mx-2"
                                />
                            </div>
                        </form>
                        <form className="form-inline" onSubmit={addContact}>
                            <div className="form-group">
                                <input
                                    type="submit"
                                    value="Add as contact and chat!"
                                    className="btn btn-primary mx-2"
                                />
                            </div>
                        </form>
                    </React.Fragment>
                }
                <h5 className="my-2">Biography</h5>
                <p id="biography">{profile.biography}</p>
                {
                    form.editing ?
                        <form onSubmit={onUpdateProfile}>
                            <div className="form-group">
                                <label>Status: </label>
                                <select
                                    required
                                    className="custom-select"
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="safe">Safe</option>
                                    <option value="unsafe">Unsafe</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ETH Wallet Address: </label>
                                <input
                                    type="text"
                                    required
                                    className="form-control"
                                    value={form.wallet}
                                    onChange={e => setForm({ ...form, wallet: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Biography: </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    required
                                    value={form.biography}
                                    onChange={e => setForm({ ...form, biography: e.target.value })}
                                >
                                </textarea>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Update Profile" className="btn btn-primary" />
                            </div>
                        </form> :
                        <input
                            type="submit"
                            value="Edit Profile"
                            className="btn btn-primary"
                            onClick={toggleForm}
                            hidden={profile.username !== user.username}
                        />
                }
            </React.Fragment>
    );
}