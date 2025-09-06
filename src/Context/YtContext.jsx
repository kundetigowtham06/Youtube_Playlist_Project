import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const YtContext = createContext();

const YtContextProvider = (props) => {
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  const [theme, setTheme] = useState("Dark");
  const toggleTheme = () => {
    setTheme(theme === "Dark" ? "Light" : "Dark");
  };
  const [viewResult, setViewResult] = useState(false);
  const [playlistLink, setPlaylistLink] = useState("");
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
  const [speed, setSpeed] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState(null);

  
  const showResult = () => {
    if (playlistLink === "") {
      toast.error("Please enter playlist link");
    } else if (!playlistLink.includes("list=") && !playlistLink.includes("/playlist?list=")) {
      toast.error("Please enter a valid YouTube playlist link");
    } else {
      setViewResult(true);
    }
  };

  
  useEffect(() => {
    const fetchPlaylist = async () => {
      
      
      if (!playlistLink.includes("list=") && !playlistLink.includes("/playlist?list=")) {
        return;
      }

      if (!apiKey) {
        toast.error("YouTube API key is not configured. Please add VITE_YOUTUBE_API_KEY to your .env file");
        return;
      }

      let playlistId;
      if (playlistLink.includes("list=")) {
        playlistId = playlistLink.split("list=")[1].split("&")[0];
      } else if (playlistLink.includes("/playlist?list=")) {
        playlistId = playlistLink.split("/playlist?list=")[1].split("&")[0];
      } else {
        toast.error("Invalid playlist URL format. Please use a valid YouTube playlist URL.");
        return;
      }
      
      
      setLoading(true);

       try {
        
         const playlistResponse = await axios.get("https://www.googleapis.com/youtube/v3/playlists", {
           params: {
             part: "snippet",
             id: playlistId,
             key: apiKey,
           },
         });
         
         
         let allItems = [];
         let nextPageToken = null;
         
         do {
           const itemsResponse = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
             params: {
               part: "snippet",
               maxResults: 50,
               playlistId: playlistId,
               key: apiKey,
               pageToken: nextPageToken,
             },
           });
           
           allItems = allItems.concat(itemsResponse.data.items);
           nextPageToken = itemsResponse.data.nextPageToken;
         } while (nextPageToken);
         
         
         const allVideoDetails = [];
         const batchSize = 50;
         
         for (let i = 0; i < allItems.length; i += batchSize) {
           const batch = allItems.slice(i, i + batchSize);
           const videoIds = batch.map(item => item.snippet.resourceId.videoId).join(',');
           
           const videosResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
             params: {
               part: "contentDetails",
               id: videoIds,
               key: apiKey,
             },
           });
           
           allVideoDetails.push(...videosResponse.data.items);
         }
         
         setPlaylistInfo(playlistResponse.data.items[0]);
         setData({
           items: allItems,
           videoDetails: allVideoDetails
         });
         toast.success(`Playlist data fetched successfully! Found ${allItems.length} videos.`);
       } catch (error) {
        console.error("Error fetching data:", error);
        
        
        if (error.response?.status === 403) {
          toast.error("API key is invalid or quota exceeded");
        } else if (error.response?.status === 404) {
          toast.error("Playlist not found or is private");
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(`Failed to fetch playlist data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (viewResult) {
      fetchPlaylist();
    }
  }, [viewResult, playlistLink, apiKey]);

  
   const value = {
     theme,
     toggleTheme,
     showResult,
     viewResult,
     setViewResult,
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
   };

  return (
    <YtContext.Provider value={value}>
      {props.children}
    </YtContext.Provider>
  );
};

export { YtContext, YtContextProvider };
export default YtContextProvider;
