import React, {useState, createContext} from "react";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [selectedTrack, setSelectedTrack] = useState(null)
    const [loading, setIsLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    return (
        <AppContext.Provider
          value={{
            selectedTrack,
            setSelectedTrack,
            loading,
            setIsLoading,
            isPlaying,
            setIsPlaying,
            isMuted, 
            setIsMuted
          }}
        >
          {children}
        </AppContext.Provider>
      );
        }