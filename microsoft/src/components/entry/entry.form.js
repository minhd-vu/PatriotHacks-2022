import React, { useState, useContext } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UserContext } from "../../contexts/user.context";
import Alert from "react-bootstrap/Alert";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

export default function EntryForm() {
    // const history = useHistory();
    const user = useContext(UserContext);
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");

    function onSubmit(e) {
        e.preventDefault();

        if (!user.isAuth) {
            return setError("Login to add a danger zone location.");
        }

        axios.post("/api/entry/", {
            location: value,
            latitude: location.lat,
            longitude: location.lng,
        }, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    user.setReload(!user.reload);

                    setValue("");
                    setLocation("");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });

    const handleInput = (e) => {
        // Update the keyword of the input element
        setValue(e.target.value);
    };

    const handleSelect = ({ description }) => () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                console.log("📍 Coordinates: ", { lat, lng });
                setLocation({ lat, lng });
            })
            .catch((error) => {
                console.log("😱 Error: ", error);
            });
    };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <button key={place_id} className="dropdown-item" onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </button>
            );
        });

    return (
        <form className="form" onSubmit={onSubmit}>
            {error && <Alert key="danger" variant="danger">{error}</Alert>}
            <Row>
                <Col md={10}>
                    <div className="form-group">
                        <div ref={ref}>
                            <input
                                value={value}
                                onChange={handleInput}
                                disabled={!ready}
                                placeholder="Location"
                                className="form-control"
                            />
                            {status === "OK" && renderSuggestions()}
                        </div>
                    </div>
                </Col>
                <Col md={2}>
                    <div className="form-group">
                        <input type="submit" value="Add Danger Zone" className="btn btn-primary" />
                    </div>
                </Col>
            </Row>
        </form>
    );
}