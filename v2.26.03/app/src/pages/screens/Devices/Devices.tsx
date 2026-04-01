import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import SmartListItem from "@/components/list/SmartListItem";
import SmartView from "@/components/list/SmartView";
import { sensorService } from "@/services/sensor/sensor.service";
import type { SensorDto } from "@/services/sensor/types";
import { useNavigate } from "react-router-dom";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  async function getDevices() {
    const response = await sensorService.find.all();
    setDevices(response.data);
  }

  const handleItemClick = (item: SensorDto) => navigate(`/devices/${item.id}`);
  const handleCreateNew = () => alert();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDevices();
  }, []);

  return (
    <SmartView
      title="Dispositivos"
      handleCreateNew={handleCreateNew}
      items={devices}
      ItemAvatar={Cpu}
      titleButton="Adicionar"
      voidMessage="Sem Dispositivos associados"
    >
      {devices.map((item, index) => (
        <SmartListItem
          item={item}
          keys={["sensorCode", "createdAt"]}
          ItemAvatar={Cpu}
          handleItemClick={handleItemClick}
          key={item?.id || index}
        />
      ))}
    </SmartView>
  );
}
