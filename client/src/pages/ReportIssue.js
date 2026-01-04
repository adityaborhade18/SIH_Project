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
import CameraCapture from "../components/CameraCapture";



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
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);


  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to report an issue');
      navigate('/login');
    }
  }, [navigate]);

  // Check geolocation permission status on mount
  useEffect(() => {
    checkPermissionStatus();
    detectCurrentLocation();
  }, []);

  const checkPermissionStatus = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(result.state);

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
          if (result.state === 'granted') {
            setPermissionDenied(false);
            detectCurrentLocation();
          }
        });
      } catch (err) {
        console.log('Permission API not supported');
      }
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);
    setPermissionDenied(false);

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
          toast.success('Location detected successfully!');
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
      (error) => {
        setLoadingLocation(false);

        // Handle different error codes
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionDenied(true);
            toast.error('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An unknown error occurred while getting location');
        }
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

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to report an issue');
      setLoading(false);
      navigate('/login');
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
        "/api/user/createissue",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
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
      console.error('Error submitting issue:', err);

      // Handle specific error cases
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || 'Invalid form data');
      } else {
        toast.error(err.response?.data?.message || 'Error submitting issue');
      }
    } finally {
      setLoading(false);
    }
  };




  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       image: file,
  //       imagePreview: reader.result,
  //     }));
  //     setErrors((prev) => ({ ...prev, image: null }));
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleCapture = (blob) => {
    const file = new File([blob], "live-photo.jpg", { type: "image/jpeg" });

    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file)
    }));

    setErrors(prev => ({ ...prev, image: null }));
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
              {/* <div>
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
              </div> */}

              {/* Camera Capture */}
              <div>
                <label className="font-semibold">Capture Image *</label>

                {!formData.imagePreview ? (
                  <div
                    className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer"
                    onClick={() => setOpenCamera(true)}
                  >
                    <p className="text-gray-500">📷 Open Camera</p>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  disabled={loadingLocation}
                >
                  {loadingLocation ? '⏳ Detecting...' : '📍 Detect Current Location'}
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

              {/* Permission Denied Alert */}
              {permissionDenied && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Location Permission Blocked
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p className="mb-2">
                          Your browser has blocked location access. To enable it:
                        </p>
                        <ol className="list-decimal ml-5 space-y-1">
                          <li>Click the <strong>🔒 lock icon</strong> or <strong>🎵 tune icon</strong> next to the URL in your browser's address bar</li>
                          <li>Find "Location" in the permissions list</li>
                          <li>Change it from "Block" to "Allow"</li>
                          <li>Refresh the page and click "Detect Current Location" again</li>
                        </ol>
                        <p className="mt-3 font-medium">
                          💡 <strong>Alternative:</strong> You can also click on the map below to manually select a location
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Permission Status Info (for development) */}
              {permissionStatus === 'prompt' && !permissionDenied && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>ℹ️ Tip:</strong> Click the "Detect Current Location" button to allow access to your location
                  </p>
                </div>
              )}

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
              <div className="h-[400px] rounded-xl overflow-hidden border relative z-10">
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


      {openCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setOpenCamera(false)}
        />
      )}

    </div>
  );
}
