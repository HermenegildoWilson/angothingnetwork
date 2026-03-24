import SmartView from "../components/shower/SmartView";
import SmartList from "../components/shower/SmartList";
import { Bell } from "lucide-react";

export default function Notificacoes() {
    return (
        <SmartView title="Notificações" subTitle="Notificações">
            <SmartList nameItem="Notificações" ItemAvatar={Bell} />
        </SmartView>
    );
}
