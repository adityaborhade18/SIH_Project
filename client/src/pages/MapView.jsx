import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default function MapView() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const res = await axios.get("/api/user/map");
            setData(res.data);
        } catch (err) {
            console.error("Error fetching map data");
        }
    };

    const getColor = (priority) => {
        if (priority > 80) return "red";
        if (priority > 50) return "orange";
        return "green";
    };

    if (!data) {
        return <div className="p-4">Loading map data...</div>;
    }

    const features = data.features;

    // 📍 Center (first issue as reference)
    const defaultCenter = [18.5204, 73.8567];
    const center =
        features.length > 0
            ? [
                features[0].geometry.coordinates[1],
                features[0].geometry.coordinates[0],
            ]
            : defaultCenter;

    // 📊 ANALYTICS
    const totalIssues = features.length;

    const resolved = features.filter(
        (f) => f.properties.status === "Resolved"
    ).length;

    const pending = features.filter(
        (f) => f.properties.status !== "Resolved"
    ).length;

    const highPriority = features.filter(
        (f) => f.properties.priority > 80
    ).length;

    const totalLikes = features.reduce(
        (sum, f) => sum + f.properties.likes,
        0
    );

    const topIssue = [...features].sort(
        (a, b) => b.properties.likes - a.properties.likes
    )[0];

    return (
        <div>
            {/* 📊 DASHBOARD */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
                <div className="bg-white shadow rounded-lg p-4 text-center">
                    <h2 className="text-lg font-bold">{totalIssues}</h2>
                    <p>Total Issues</p>
                </div>

                <div className="bg-yellow-100 shadow rounded-lg p-4 text-center">
                    <h2 className="text-lg font-bold">{pending}</h2>
                    <p>Pending</p>
                </div>

                <div className="bg-green-100 shadow rounded-lg p-4 text-center">
                    <h2 className="text-lg font-bold">{resolved}</h2>
                    <p>Resolved</p>
                </div>

                <div className="bg-red-100 shadow rounded-lg p-4 text-center">
                    <h2 className="text-lg font-bold">{highPriority}</h2>
                    <p>High Priority</p>
                </div>

                <div className="bg-blue-100 shadow rounded-lg p-4 text-center">
                    <h2 className="text-lg font-bold">{totalLikes}</h2>
                    <p>Total Likes</p>
                </div>
            </div>

            {/* 🔥 TOP ISSUE */}
            {topIssue && (
                <div className="bg-purple-100 p-4 mx-4 rounded-lg shadow mb-4">
                    <h3 className="font-bold">🔥 Most Reported Issue</h3>
                    <p>{topIssue.properties.title}</p>
                    <p>👍 {topIssue.properties.likes} likes</p>
                </div>
            )}

            {/* 🗺️ MAP */}
            <MapContainer
                center={center}
                zoom={10}
                style={{ height: "80vh", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* 🔵 Center Marker */}
                <CircleMarker center={center} radius={10} pathOptions={{ color: "blue" }}>
                    <Popup>Your Area Center</Popup>
                </CircleMarker>

                {/* 🔴 CITY RADIUS (100km for better visibility) */}
                <Circle
                    center={center}
                    radius={25000}
                    pathOptions={{
                        color: "yellow",
                        fillColor: "yellow",
                        fillOpacity: 0.1,
                    }}
                />

                {/* 🔴 ALL ISSUES */}
                {features.map((feature, i) => (
                    <CircleMarker
                        key={i}
                        center={[
                            feature.geometry.coordinates[1],
                            feature.geometry.coordinates[0],
                        ]}
                        radius={5 + feature.properties.priority / 20}
                        pathOptions={{
                            color: getColor(feature.properties.priority),
                        }}
                    >
                        <Popup>
                            <h3>{feature.properties.title}</h3>
                            <p>👍 {feature.properties.likes}</p>
                            <p>🚨 Level {feature.properties.escalation}</p>
                            <p>Status: {feature.properties.status}</p>

                            <button
                                style={{
                                    marginTop: "10px",
                                    padding: "6px 12px",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={async () => {
                                    try {
                                        await axios.post(
                                            `/api/user/${feature.properties.id}/like`,
                                            {},
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem(
                                                        "token"
                                                    )}`,
                                                },
                                            }
                                        );
                                        fetchIssues();
                                    } catch (err) {
                                        console.log("Like error");
                                    }
                                }}
                            >
                                👍 Like
                            </button>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}