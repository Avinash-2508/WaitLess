import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import Button from '../components/Button';
import { showSuccess, showError } from '../utils/toastManager';
import API, { getCountersByShop } from "../api";

export default function CounterPanel() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [currentToken, setCurrentToken] = useState(0);
  const [nextToken, setNextToken] = useState(null);
  const [waiting, setWaiting] = useState(0);
  const [counters, setCounters] = useState([]);
  const [selectedCounterId, setSelectedCounterId] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("staffId")) {
      window.location.href = "/staff-login";
    }
  }, []);

  // Fetch counters
  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res = await getCountersByShop(shopId);
        if (res.data.success) {
          setCounters(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedCounterId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch counters:', err);
        showError('Failed to load counters');
      } finally {
        setLoading(false);
      }
    };

    fetchCounters();
  }, [shopId]);

  useEffect(() => {
    API.get(`/queue/${shopId}`).then((res) => {
      const queueData = res.data.data;
      setCurrentToken(queueData.currentToken);
      setWaiting(queueData.waiting);
      setNextToken(queueData.currentToken + 1);
    });

    const socket = io("http://localhost:5000");
    socket.on("queueUpdate", (data) => {
      if (data?.shopId === shopId) {
        setCurrentToken(data.currentToken);
        setWaiting(data.waiting);
        setNextToken(data.currentToken + 1);
        // Auto-announce when voice is enabled
        if (voiceEnabled && data.currentToken > 0) {
          announceToken(data.currentToken);
        }
      }
    });

    return () => socket.disconnect();
  }, [shopId, voiceEnabled]);

  const announceToken = async (tokenNum) => {
    if (!voiceEnabled || isAnnouncing) return;

    setIsAnnouncing(true);
    try {
      const counter = counters.find(c => c.id === selectedCounterId);
      const counterName = counter?.name || 'Counter';

      // Use Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Token number ${String(tokenNum).padStart(2, '0')}, please proceed to ${counterName}`
        );
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Voice announcement error:', err);
    } finally {
      setIsAnnouncing(false);
    }
  };

  const handleToggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      showSuccess('Voice announcements enabled');
    }
  };

  const handleAnnounceNow = () => {
    if (currentToken > 0) {
      announceToken(currentToken);
    } else {
      showError('No active token to announce');
    }
  };

  const handleServeNext = async () => {
    const staffId = localStorage.getItem("staffId");
    await API.post(`/queue/${shopId}/next`, { staffId: staffId || null });
    const res = await API.get(`/queue/${shopId}`);
    const queueData = res.data.data;
    setCurrentToken(queueData.currentToken);
    setWaiting(queueData.waiting);
    setNextToken(queueData.currentToken + 1);
  };

  const handleSkip = async () => {
    try {
      await API.post(`/queue/${shopId}/skip`);
      const res = await API.get(`/queue/${shopId}`);
      const queueData = res.data.data;
      setCurrentToken(queueData.currentToken);
      setWaiting(queueData.waiting);
      setNextToken(queueData.currentToken + 1);
      alert("Token skipped.");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details?.join(", ") ||
        "Skip failed";
      alert(errorMsg);
    }
  };

  const handleRecall = () => {
    alert(`Recalling Token #${currentToken}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/staff-login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full"></div>
          <p className="text-gray-600">Loading counter panel...</p>
        </div>
      </div>
    );
  }

  if (counters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">No counters configured for this shop.</p>
          <Button
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center max-w-full overflow-x-hidden px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Counter Panel</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage customers in queue</p>
        </div>

        {/* Counter Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Counter Assignment</label>
          <select
            value={selectedCounterId}
            onChange={(e) => setSelectedCounterId(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {counters.map((counter) => (
              <option key={counter.id} value={counter.id}>
                {counter.name} (#{counter.number})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center border-2 border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-3">Currently Serving</p>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600">#{String(currentToken).padStart(2, "0")}</p>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-lg p-6 sm:p-8 text-center border-2 border-blue-200">
            <p className="text-xs sm:text-sm text-blue-600 font-medium mb-3">Next in Queue</p>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-700">{nextToken ? `#${String(nextToken).padStart(2, "0")}` : "—"}</p>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="space-y-3 bg-white rounded-xl shadow-lg p-6">
          <Button
            onClick={handleToggleVoice}
            className={`w-full px-4 py-3 font-semibold rounded-lg transition-colors min-h-[52px] text-base ${
              voiceEnabled
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </Button>

          {voiceEnabled && (
            <Button
              onClick={handleAnnounceNow}
              disabled={isAnnouncing}
              className="w-full px-4 py-3 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50 min-h-[52px] text-base"
            >
              {isAnnouncing ? 'Announcing...' : '📢 Announce Now'}
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={handleServeNext}
            className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-lg min-h-[52px] text-base sm:text-lg"
          >
            Serve Next
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-yellow-500 text-white font-semibold py-4 px-6 rounded-xl hover:bg-yellow-600 active:scale-95 transition-all shadow-lg min-h-[52px] text-base sm:text-lg"
          >
            Skip Customer
          </button>

          <button
            onClick={handleRecall}
            className="w-full bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-lg min-h-[52px] text-base sm:text-lg"
          >
            Recall Current
          </button>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="text-base sm:text-lg text-gray-700">
            Waiting: <span className="font-bold text-orange-600">{waiting}</span> customers
          </p>
        </div>

        <a
          href={`/history/${shopId}`}
          className="text-center text-blue-600 hover:underline font-semibold text-sm sm:text-base min-h-[44px] flex items-center justify-center"
        >
          View Token History
        </a>

        <Button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 min-h-[44px]"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
