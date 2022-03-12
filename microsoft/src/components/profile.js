import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { UserContext } from "../contexts/user.context";
import Web3 from "web3";

export default function Profile(props) {
    const user = useContext(UserContext);
    const [error, setError] = useState("");
    const [eth, setEth] = useState("");
    const [profile, setProfile] = useState({});

    useEffect(() => {
        let username = props.match?.params?.username || user.username;

        axios.get("/api/user/" + username, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setProfile(res.data);
                    setError("");
                } else if (res.status === 204) {
                    setError(`No user found with username ${username}`);
                }
            })
            .catch(err => console.log(err));
    }, [props, user.username]);

    async function onSubmit(e) {
        e.preventDefault();

        if (!window.ethereum) {
            return setError("Install Metamask.");
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

    return (
        <React.Fragment>
            <h3>{profile.username}'s Profile
                {
                    profile.status === "safe" ?
                        <span class="badge badge-success mx-2">Safe</span> :
                        <span class="badge badge-danger mx-2">Unsafe</span>
                }
            </h3>
            {
                error && <Alert key="danger" variant="danger">{error}</Alert>
            }
            <h5>ETH Wallet Address: {profile.wallet}</h5>
            {
                profile.username !== user.username &&
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
            }
            <br />
            <h5>Biography</h5>
            <p id="biography">{profile.biography}</p>
        </React.Fragment>
    );
}