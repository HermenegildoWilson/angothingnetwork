import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu } from "lucide-react";
import { api } from "../../api/axios";
import SmartList from "../../components/shower/SmartList";
import SmartView from "../../components/shower/SmartView";

export default function Dispositivos() {
    const navigate = useNavigate();

    const [pageState, setPageState] = useState("loading");
    const [dispositivos, setDispositivos] = useState([]);

    async function getDispositivos() {
        try {
            const { data } = await api.get("/sensors/sensors");
            const disps = data?.data;

            // Fallback seguro para strings de localização
            const lista = [];
            disps.map((disp) => {
                const loc = disp?.sensor_location || {};
                const city = loc.cidade || "";
                const province = loc.provincia || "";
                const country = loc.pais || "";

                // eslint-disable-next-line no-unused-vars
                const locationParts = [city, province, country].filter(
                    (p) => typeof p === "string" && p.length > 0,
                );

                const locationString = "Uíge, Uíge, Angola";
                    //locationParts.join(", ") || "Localização não definida";

                lista.push({
                    sensor_code: disp?.sensor_code,
                    locationString: locationString,
                    id: disp?.id,
                });
            });

            setDispositivos(lista);
        } catch (error) {
            console.error("Erro ao buscar dispositivos:", error);
            setDispositivos([]);
        } finally {
            setPageState("done");
        }
    }

    useEffect(() => {
        getDispositivos();
    }, []);

    const handleCreateNew = () => navigate("/novodispositivo");
    const handleItemClick = (item) => {
         navigate(`/dispositivo/${item.id}`)
    }

    return (
        <SmartView
            handleCreateNew={handleCreateNew}
            pageState={pageState}
            title="Meus Dispositivos"
            subTitle="Gestão de sensores e monitorização IoT"
            titleButton="Novo Dispositivo"
        >
            <SmartList
                items={dispositivos}
                keys={["sensor_code", "locationString"]}
                handleCreateNew={handleCreateNew}
                nameItem="Dispositivo"
                ItemAvatar={Cpu}
                handleItemClick={handleItemClick}
            />
        </SmartView>
    );
}
