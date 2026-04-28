import { useEffect, useState } from "react";
import SmartView from "@/components/list/SmartView";
import SmartListItem from "@/components/list/SmartListItem";
import { userService } from "@/services/user/user.service";
import { useNavigate } from "react-router-dom";
import type { UserDto } from "@/services/user/types";
import { User } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  async function getUsers() {
    const response = await userService.find.all();
    console.log(...response.data);
    setUsers([...response.data]);
  }

  const handleItemClick = (item: UserDto) => navigate(`/profile/${item.id}`);
  const handleCreateNew = () => alert();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getUsers();
  }, []);

  return (
    <SmartView
      title="Usuários"
      handleCreateNew={handleCreateNew}
      items={users}
      ItemAvatar={User}
      titleButton="Adicionar"
      voidMessage="Sem usuários cadastrados"
    >
      {users.map((item, index) => (
        <SmartListItem
          item={item}
          keys={["name", "phone"]}
          ItemAvatar={User}
          handleItemClick={handleItemClick}
          key={item?.id || index}
        />
      ))}
    </SmartView>
  );
}
