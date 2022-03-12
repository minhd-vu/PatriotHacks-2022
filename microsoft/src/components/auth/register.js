import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom"
import axios from "axios";
import { UserContext } from "../../contexts/user.context";

export default function Register() {
    const history = useHistory();
    const user = useContext(UserContext);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ status: "safe" });

    function onSubmit(e) {
        console.log(form);
        e.preventDefault();

        if (!form.username.match("^[A-Za-z][A-Za-z0-9_]*")) {
            return setError("Username invalid. Username must start with letter and all other characters must be alphabets, numbers, or underscore.")
        }

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }

        axios.post("/api/register", {
            username: form.username.trim().toLowerCase(),
            name: form.name,
            password: form.password,
            status: form.status,
        }, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    user.setUsername(form.username);
                    user.setAuth(true);
                    history.push("/");
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 401) {
                    setError("Username is already in use.");
                }
            });
    }

    return (
        <div>
            <h3>Register</h3>
            {
                error && <div className="alert alert-danger" role="alert">{error}</div>
            }
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                    <input
                        type="text"
                        required
                        className="form-control"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Name: </label>
                    <input
                        type="text"
                        required
                        className="form-control"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
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
                    <label>Password: </label>
                    <input
                        type="password"
                        required
                        className="form-control"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password: </label>
                    <input
                        type="password"
                        required
                        className="form-control"
                        value={form.confirmPassword}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input type="submit" value="Register" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
}