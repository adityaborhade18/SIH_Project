import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";


// Leaflet marker fix
const DefaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ReportIssue() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    priority: "",
    description: "",
    image: null,
    imagePreview: null,
    position: null,
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Auto detect location on load
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            position: [lat, lng],
            address: data.display_name || `Lat: ${lat}, Lng: ${lng}`,
          }));
        } catch (err) {
          // fallback to coords if reverse geocode fails
          setFormData((prev) => ({
            ...prev,
            position: [lat, lng],
            address: `Lat: ${lat}, Lng: ${lng}`,
          }));
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Map click handler - sets pos + reverse geocode
  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            position: [lat, lng],
            address: data.display_name || `Lat: ${lat}, Lng: ${lng}`,
          }));
        } catch (err) {
          setFormData((prev) => ({
            ...prev,
            position: [lat, lng],
            address: `Lat: ${lat}, Lng: ${lng}`,
          }));
        }

        setErrors((prev) => ({ ...prev, position: null }));
      }
    });
    return null;
  };

  // Auto-center map when position changes
  const MapAutoCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (formData.position && map) {
        map.setView(formData.position, 16);
      }
    }, [formData.position, map]);
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Issue type is required";
    if (!formData.priority.trim()) newErrors.priority = "Priority is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.position) newErrors.position = "Please select a location";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
  //   // Submit form data to backend or API
   
  //   // Reset form
    
    
  // };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!validateForm()) {
    setLoading(false);
    return;
  }

  try {
    // Build location object in correct format
    const locationObject = {
      type: "Point",
      coordinates: [
        formData.position[1], // lng FIRST
        formData.position[0]  // lat SECOND
      ],
      address: formData.address,
    };

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("priority", formData.priority);

    // Must send as string because backend parses JSON
    form.append("location", JSON.stringify(locationObject));

    if (formData.image) {
      form.append("image", formData.image);
    }

    const response = await axios.post(
      "http://localhost:5000/api/user/createissue",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    toast.success("Issue reported successfully!");

    // Reset form
    setFormData({
      title: "",
      priority: "",
      description: "",
      image: null,
      imagePreview: null,
      position: null,
      address: "",
    });

    navigate("/");

  } catch (err) {
    toast.error(err.response?.data?.message || "Error submitting issue");
  } finally {
    setLoading(false);
  }
};




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }));
      setErrors((prev) => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
          Report an Issue
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* LEFT SIDE */}
            <div className="space-y-6">

              {/* Issue Type */}
              <div>
                <label className="font-semibold">Issue Type *</label>
                <select
                  className="w-full mt-1 border rounded-lg p-3"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                >
                  <option value="">Select Issue</option>
                  <option value="Pothole">Pothole</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Street Light">Street Light</option>
                  <option value="Water Leakage">Water Leakage</option>
                  <option value="Other">Other</option>
                </select>
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="font-semibold">Priority *</label>
                <select
                  className="w-full mt-1 border rounded-lg p-3"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-sm">{errors.priority}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold">Description *</label>
                <textarea
                  rows="4"
                  className="w-full mt-1 border rounded-lg p-3"
                  placeholder="Describe the issue..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="font-semibold">Upload Image *</label>

                {!formData.imagePreview ? (
                  <div
                    className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <p className="text-gray-500">Click to upload</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      className="text-red-600 font-semibold"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: null,
                          imagePreview: null,
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">

              {/* Detect Location Button */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  📍 Detect Current Location
                </button>

                {/* Latitude & Longitude read-only fields */}
                <div className="flex gap-3 items-center">
                  <div>
                    <label className="text-sm font-medium">Latitude</label>
                    <input
                      readOnly
                      value={
                        formData.position ? formData.position[0].toFixed(6) : ""
                      }
                      className="ml-2 border rounded px-3 py-2 w-40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Longitude</label>
                    <input
                      readOnly
                      value={
                        formData.position ? formData.position[1].toFixed(6) : ""
                      }
                      className="ml-2 border rounded px-3 py-2 w-40"
                    />
                  </div>
                </div>
              </div>

              {/* Address Box */}
              <div>
                <label className="font-semibold block mb-1">Selected Address</label>
                <div className="p-3 border rounded-lg bg-gray-50 min-h-[64px]">
                  {formData.address ? (
                    <p className="text-blue-700 text-sm">{formData.address}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">No location selected</p>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="h-[400px] rounded-xl overflow-hidden border">
                {loadingLocation ? (
                  <p className="text-gray-500 p-3">Fetching location...</p>
                ) : (
                  <MapContainer
                    center={
                      formData.position || [19.0760, 72.8777]
                    }
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler />
                    <MapAutoCenter />

                    {formData.position && (
                      <Marker position={formData.position}>
                        <Popup>{formData.address}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                )}
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.position}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-8 w-[200px] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
