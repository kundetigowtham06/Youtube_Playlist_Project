import React, { useContext} from "react";
import { YtContext } from "../Context/YtContext";

const Hero = () => {
  const { 
    theme,
    showResult,
    viewResult,
    playlistLink,
    setPlaylistLink,
    startRange,
    setStartRange,
    endRange,
    setEndRange,
    speed,
    setSpeed,
    data,
    loading,
    playlistInfo,
  } = useContext(YtContext);

  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const calculateStats = () => {
    if (!data?.videoDetails) return { totalDuration: 0, videoCount: 0, avgLength: 0 };
    
    let videos = data.videoDetails;
    
    if (startRange && endRange) {
      const start = parseInt(startRange) - 1;
      const end = parseInt(endRange);
      videos = videos.slice(start, end);
    } else if (startRange) {
      const start = parseInt(startRange) - 1;
      videos = videos.slice(start);
    } else if (endRange) {
      const end = parseInt(endRange);
      videos = videos.slice(0, end);
    }
    
    const totalDuration = videos.reduce((total, video) => {
      return total + parseDuration(video.contentDetails.duration);
    }, 0);
    
    const videoCount = videos.length;
    const avgLength = videoCount > 0 ? Math.round(totalDuration / videoCount) : 0;
    
    return { totalDuration, videoCount, avgLength };
  };

  const stats = calculateStats();

  return (
    <>
      <div className="pt-20 px-8 py-12 min-h-screen flex">
        <div className="items-center text-center mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to PlayMeter
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Your time matters! With Playlist-Len, you can find out exactly how
            long it will take to finish any YouTube playlist. Just drop the
            link, and we’ll crunch the numbers for you. From study sessions to
            entertainment marathons, Playlist-Len makes planning your watchlist
            simple and fun.
          </p>
          <div
            className={`border-2 border-dashed p-6 rounded-lg max-w-3xl mx-auto transition-colors duration-300 ${
              theme === "Dark"
                ? "border-gray-600 bg-gray-800/30 backdrop-blur-sm"
                : "border-gray-400 bg-white/50 backdrop-blur-sm"
            }`}
          >
            <input
              type="text"
              placeholder="Enter YouTube Playlist Link"
              value={playlistLink}
              onChange={(e) => setPlaylistLink(e.target.value)}
              className={`w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                theme === "Dark"
                  ? "text-white placeholder:text-gray-400 bg-gray-700/50 border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-500"
                  : "text-black placeholder:text-gray-600 bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400"
              }`}
            />
            <p
              className={`text-sm pt-2 ${
                theme === "Dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              You can Optionally set a range for the total duration and set
              speed.It is for advanced users who want more control over their
              playback experience.
            </p>
            <div className="mt-4 flex justify-center flex-wrap gap-2">
              <input
                type="number"
                name="Start"
                placeholder="Start"
                value={startRange}
                onChange={(e) => setStartRange(e.target.value)}
                className={`w-24 border rounded-md p-2 transition-colors duration-300 ${
                  theme === "Dark"
                    ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                    : "border-gray-300 bg-white text-black placeholder:text-gray-600 focus:border-blue-500"
                }`}
              />
              <span
                className={`mx-2 self-center ${
                  theme === "Dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                to
              </span>
              <input
                type="number"
                name="End"
                placeholder="End"
                value={endRange}
                onChange={(e) => setEndRange(e.target.value)}
                className={`w-24 border rounded-md p-2 transition-colors duration-300 ${
                  theme === "Dark"
                    ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                    : "border-gray-300 bg-white text-black placeholder:text-gray-600 focus:border-blue-500"
                }`}
              />
              <input
                type="number"
                name="Speed"
                min={0.25}
                max={2}
                step={0.25}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                placeholder="Speed"
                className={`w-24 border rounded-md p-2 transition-colors duration-300 ${
                  theme === "Dark"
                    ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                    : "border-gray-300 bg-white text-black placeholder:text-gray-600 focus:border-blue-500"
                }`}
              />
              <button
                className={`px-4 py-2 rounded-md transition-all duration-300 mx-1 font-medium ${
                  theme === "Dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
                }`}
                onClick={showResult}
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
      {viewResult && (
        <div className="pt-8 px-8 pb-12">
          <div
            className={`border-2 border-dashed p-6 rounded-lg max-w-4xl mx-auto transition-colors duration-300 ${
              theme === "Dark"
                ? "border-gray-600 bg-gray-800/30 backdrop-blur-sm"
                : "border-gray-400 bg-white/50 backdrop-blur-sm"
            }`}
          >
            <div className="text-center mb-6">
            <h2
              className={`text-2xl md:text-3xl font-bold mb-2 ${
                theme === "Dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Playlist Analysis Results
            </h2>
            <p
              className={`text-sm ${
                theme === "Dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Detailed breakdown of your YouTube playlist
            </p>
          </div>
          <div
            className={`p-4 rounded-lg border mb-6 transition-colors duration-300 ${
              theme === "Dark"
                ? "bg-gray-700/30 border-gray-600"
                : "bg-white/50 border-gray-300"
            }`}
          >
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p>Playlist Name : {loading ? "Loading..." : (playlistInfo?.snippet?.title || "No data")}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p>Creator : {loading ? "Loading..." : (playlistInfo?.snippet?.channelTitle || "No data")}</p>
              </div>
              {(startRange || endRange) && (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <p className="text-sm text-blue-500">
                    📊 Showing videos {startRange ? `${startRange}` : "1"} to {endRange || data?.videoDetails?.length || "end"}
                  </p>
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg border transition-colors duration-300 ${
                theme === "Dark"
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-white/70 border-gray-300"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    theme === "Dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {loading ? "Loading..." : formatTime(stats.totalDuration)}
                </div>
                <div
                  className={`text-sm ${
                    theme === "Dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Total Duration
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border transition-colors duration-300 ${
                theme === "Dark"
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-white/70 border-gray-300"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    theme === "Dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {loading ? "Loading..." : stats.videoCount}
                </div>
                <div
                  className={`text-sm ${
                    theme === "Dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Videos
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border transition-colors duration-300 ${
                theme === "Dark"
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-white/70 border-gray-300"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    theme === "Dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  {loading ? "Loading..." : formatTime(stats.avgLength)}
                </div>
                <div
                  className={`text-sm ${
                    theme === "Dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Avg Length
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border mb-6 transition-colors duration-300 ${
              theme === "Dark"
                ? "bg-gray-700/30 border-gray-600"
                : "bg-white/50 border-gray-300"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>At 1.25x :</p>
              <p
                className={`text-sm ${
                  theme === "Dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {loading ? "Loading..." : formatTime(Math.round(stats.totalDuration / 1.25))}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>At 1.50x :</p>
              <p
                className={`text-sm ${
                  theme === "Dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {loading ? "Loading..." : formatTime(Math.round(stats.totalDuration / 1.5))}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>At 1.75x :</p>
              <p
                className={`text-sm ${
                  theme === "Dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {loading ? "Loading..." : formatTime(Math.round(stats.totalDuration / 1.75))}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>At 2.00x :</p>
              <p
                className={`text-sm ${
                  theme === "Dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {loading ? "Loading..." : formatTime(Math.round(stats.totalDuration / 2.0))}
              </p>
            </div>
            {speed !== 1 && (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p>At {speed}x (Custom) :</p>
                <p
                  className={`text-sm font-semibold ${
                    theme === "Dark" ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  {loading ? "Loading..." : formatTime(Math.round(stats.totalDuration / speed))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Hero;
