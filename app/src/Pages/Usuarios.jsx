import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import SmartView from "../components/shower/SmartView";
import SmartList from "../components/shower/SmartList";
import { UserCircle } from "lucide-react";

export default function Dispositivos() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState("loading");
  const [usuarios, setUsuarios] = useState([]);

  async function getUsuarios() {
    try {
      const url = "/user/usuarios";
      const { data } = await api.get(url);
      return setUsuarios(data.data);
    } catch (error) {
      console.log(error);

      setUsuarios([]);
    } finally {
      setPageState("done");
    }
  }

  useEffect(() => {
    getUsuarios();
  }, []);

  const handleCreateNew = () => {
    navigate("/cadastrar");
  };

  const handleItemClick = (item) => {
    navigate(`/perfil/${item.id}`);
  };

  return (
    <SmartView
      title="Usuarios"
      pageState={pageState}
      titleButton="Novo Usuário"
      subTitle="Gestão de usuarios"
      //handleCreateNew={handleCreateNew}
    >
      <SmartList
        items={usuarios}
        nameItem="Usuario"
        ItemAvatar={UserCircle}
        keys={["nome", "role"]}
        handleItemClick={handleItemClick}
        handleCreateNew={handleCreateNew}
      />
    </SmartView>
  );
}
