import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function TokenHistory() {
  const { shopId: paramShopId } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const shopId = paramShopId || localStorage.getItem("shopId");

  useEffect(() => {
    if (!shopId) {
      console.log("⚠️ No shopId found");
      setLoading(false);
      return;
    }
    console.log("📋 Fetching history for shopId:", shopId);
    API.get(`/queue/history/${shopId}`)
      .then((res) => {
        console.log("📋 History response:", res.data);
        // Handle new response format with data wrapper
        const data = res.data.data?.tokens || (Array.isArray(res.data) ? res.data : []);
        console.log("📋 Parsed history items:", data.length);
        setList(data);
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.details?.join(", ") ||
          "Failed to fetch history";
        console.error("❌ History fetch error:", errorMsg);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, [shopId]);

  return (
    <div className="flex justify-center items-start min-h-screen max-w-full overflow-x-hidden px-4 sm:px-6 py-6 sm:py-8">
      <div className="text-center w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Token History</h1>
          <p className="text-sm sm:text-base text-gray-500">View all issued tokens and their status</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading history...</p>
        ) : list.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No tokens yet.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-4 text-left font-semibold text-gray-800">Token</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Payment ID</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Taken At</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Served By</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Served At</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((t, index) => (
                    <tr key={t.id || index} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-900 font-semibold">#{String(t.tokenNumber || t.token).padStart(2, "0")}</td>
                      <td className="p-4 text-gray-700 text-sm">{t.paymentId || "—"}</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {t.servedBy || "—"}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {t.servedAt ? new Date(t.servedAt).toLocaleString() : "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            t.status === "served"
                              ? "bg-green-100 text-green-700"
                              : t.status === "missed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {t.status || "waiting"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {list.map((t, index) => (
                <div key={t.id || index} className="bg-white rounded-xl shadow p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Token #{String(t.tokenNumber || t.token).padStart(2, "0")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.status === "served"
                          ? "bg-green-100 text-green-700"
                          : t.status === "missed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status || "waiting"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="text-gray-900 font-medium">{t.paymentId || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taken At:</span>
                      <span className="text-gray-900 font-medium">
                        {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
                      </span>
                    </div>
                    {t.servedBy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Served By:</span>
                        <span className="text-gray-900 font-medium">{t.servedBy}</span>
                      </div>
                    )}
                    {t.servedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Served At:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(t.servedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <a
          href="/"
          className="text-blue-600 hover:underline font-semibold text-sm sm:text-base min-h-[44px] flex items-center justify-center"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
