import type { Timeline as TypeIconeMui } from "@mui/icons-material";
import {
  CloudQueue,
  Timeline,
  Security,
  Devices,
  Air,
  WaterDrop,
  Grass,
  Agriculture,
  Business,
  MedicalServices,
  School,
  TrendingUp,
  Analytics,
  AssignmentTurnedIn,
} from "@mui/icons-material";


export type FeatureItem = {
  Icon: typeof TypeIconeMui;
  title: string;
  desc: string;
};

export type SectorItem = {
  Icon: typeof TypeIconeMui;
  title: string;
  sensor: string;
  desc: string;
  color: string;
};

export type SocialImpactItem = {
  Icon: typeof TypeIconeMui;
  title: string;
  desc: string;
};

export const featureItems: FeatureItem[] = [
  {
    Icon: Timeline,
    title: "Precisão em Tempo Real",
    desc: "Sensores calibrados para entregar métricas com fidelidade laboratorial a cada segundo.",
  },
  {
    Icon: CloudQueue,
    title: "Ecossistema Cloud",
    desc: "Seus dados armazenados com segurança e acessíveis de qualquer lugar do planeta.",
  },
  {
    Icon: Devices,
    title: "Dashboards Responsivos",
    desc: "Uma experiência fluida e intuitiva tanto no desktop quanto no seu smartphone.",
  },
  {
    Icon: Security,
    title: "Inteligência Preditiva",
    desc: "Alertas inteligentes que antecipam condições críticas antes que se tornem problemas.",
  },
];

export const monitoringSectors: SectorItem[] = [
  {
    Icon: Air,
    title: "Atmosfera e Qualidade do Ar",
    sensor: "BME680 Precision",
    desc: "Evite riscos ocupacionais e ambientais. Monitorização contínua de COV, pressão atmosférica e microclimas com alertas instantâneos.",
    color: "#3b82f6",
  },
  {
    Icon: WaterDrop,
    title: "Recursos Hídricos Críticos",
    sensor: "TDS, PH & Turbidez",
    desc: "Garanta a pureza da água. Analise a presença de sólidos, níveis de acidez e claridade para consumo ou processos industriais.",
    color: "#0ea5e9",
  },
  {
    Icon: Grass,
    title: "Saúde e Nutrição do Solo",
    sensor: "DS18B20 & Humidade",
    desc: "Maximize a produtividade agrícola. Dados profundos sobre humidade e temperatura para otimização de rega e colheita.",
    color: "#10b981",
  },
];

export const socialImpactItems: SocialImpactItem[] = [
  {
    Icon: Agriculture,
    title: "Agronegócio",
    desc: "Otimize colheitas monitorando microclimas e humidade do solo com precisão cirúrgica.",
  },
  {
    Icon: MedicalServices,
    title: "Saúde Pública",
    desc: "Controle a qualidade do ar em hospitais e centros urbanos para prevenir doenças respiratórias.",
  },
  {
    Icon: Business,
    title: "Indústria 4.0",
    desc: "Garanta a conformidade ambiental e a segurança operacional em plantas industriais complexas.",
  },
  {
    Icon: School,
    title: "Educação e Pesquisa",
    desc: "Dados reais para o desenvolvimento científico e conscientização ambiental em escolas.",
  },
  {
    title: "Redução de Custos",
    desc: "Poupe até 30% em recursos hídricos e energia através de regas e ventilação baseadas em dados reais.",
    Icon: TrendingUp,
  },
  {
    title: "Conformidade Legal",
    desc: "Relatórios automatizados que cumprem as normas ambientais vigentes, evitando multas e sanções.",
    Icon: AssignmentTurnedIn,
  },
  {
    title: "Decisões em Segundos",
    desc: "Não espere por análises laboratoriais lentas. Obtenha a resposta que precisa no seu telemóvel.",
    Icon: Analytics,
  },
];
