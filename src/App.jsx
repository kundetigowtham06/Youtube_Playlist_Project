import React, { useContext } from "react";
import NavBar from "./Components/NavBar";
import Hero from "./Components/Hero";
import YtContextProvider, { YtContext } from "./Context/YtContext";
import { ToastContainer } from "react-toastify";


const AppContent = () => {
  const { theme } = useContext(YtContext);
  
  return (
    <div className={`min-h-screen w-screen transition-colors duration-300 ${
      theme === "Dark"
        ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
        : "bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-100 text-black"
    }`}>
      <NavBar />
      <Hero />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "Dark" ? "dark" : "light"}
      />
    </div>
  );
};

const App = () => {
  return (
    <YtContextProvider>
      <AppContent />
    </YtContextProvider>
  );
};  

export default App;
