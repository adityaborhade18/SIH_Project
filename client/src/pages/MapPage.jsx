// pages/MapPage.jsx
import React, { useEffect, useState } from "react";

const MapPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const res = await fetch("/api/issues/map");

                if (!res.ok) {
                    throw new Error("Failed to fetch map data");
                }

                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, []);

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading map data...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Issues Map</h2>

            {/* Temporary placeholder (you can replace with Google Maps / Leaflet later) */}
            <div style={{ marginTop: "20px" }}>
                <h3>Fetched Locations</h3>

                {data.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                <strong>{item.title || "No Title"}</strong>
                                <br />
                                Lat: {item.latitude || item.lat}, Lng: {item.longitude || item.lng}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MapPage;