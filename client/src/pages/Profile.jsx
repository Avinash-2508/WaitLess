import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonBlock from '../components/SkeletonBlock';
import { showError } from '../utils/toastManager';
import API from "../api";

export default function Profile() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const ownerId = localStorage.getItem("ownerId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!ownerId) {
      navigate("/login");
      return;
    }

    API.get(`/shop/owner/${ownerId}`)
      .then((res) => {
        // Handle new response format
        const shopData = res.data.data?.shop || res.data;
        setData(shopData || {});
      })
      .catch((err) => {
        console.error("Profile fetch error:", err.message);
        showError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ownerId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 py-6 sm:py-8 bg-gray-50">
      {loading ? (
        <SkeletonBlock variant="card" />
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">Profile</h1>
          <div className="space-y-4 sm:space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Owner ID</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800 break-all">{ownerId}</p>
            </div>
            
            <div className="pb-4 border-b border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Shop Name</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{data?.name || "N/A"}</p>
            </div>
            
            <div className="pb-4 border-b border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Address</p>
              <p className="text-sm sm:text-base text-gray-700">{data?.address || "N/A"}</p>
            </div>
            
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Category</p>
              <p className="text-sm sm:text-base text-gray-700">{data?.category || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
