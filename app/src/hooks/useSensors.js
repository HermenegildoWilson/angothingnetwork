import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";

export const useSensors = () => {
    const context = useContext(SensorContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro do SensorProvider");
    }
    
    return context;
};
