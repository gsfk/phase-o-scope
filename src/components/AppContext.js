import React, {useState, createContext} from "react";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [selectedTrack, setSelectedTrack] = useState(null)

    return (
        <AppContext.Provider
          value={{
            selectedTrack,
            setSelectedTrack,
          }}
        >
          {children}
        </AppContext.Provider>
      );
        }