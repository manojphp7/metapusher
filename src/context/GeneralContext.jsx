import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/appConstants";

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  // ✅ Future variables yahan add karo
  // const [someOtherVar, setSomeOtherVar] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}${API_ENDPOINTS.ConfigSettings}/get?key=maintenance_mode`)
      .then((res) => res.json())
      .then((data) => setMaintenanceMode(data.maintenance_mode))
      .catch(() => setMaintenanceMode(false));
  }, []);

  const value = {
    maintenanceMode,
    setMaintenanceMode,
    // someOtherVar,
    // setSomeOtherVar,
  };

  return (
    <GeneralContext.Provider value={value}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);