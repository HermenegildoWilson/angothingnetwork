import { Avatar, Box, Card, Typography, Divider, Paper } from "@mui/material";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  AtSign,
  IdCard,
} from "lucide-react";
import type { UserDto } from "@/services/user/types";
import MoreVertMenu from "@/components/modal/MoreVertMenu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "@/services/user/user.service";
import { useAuth } from "@/hooks/useAuth";

const iconMapper = {
  id: IdCard,
  name: User,
  email: Mail,
  phone: Phone,
  username: AtSign,
  role: Shield,
  createdAt: Calendar,
};

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserDto>(user);

  useEffect(() => {
    const getProfile = async () => {
      const response = await userService.find.one(id);
      setProfile(response.data);
    };

    if (id) {
      getProfile();
    }
  }, [id, user]);

  return (
    <Box
      sx={{
        py: { xs: 2, md: 2.5 },
      }}
    >
      <Box maxWidth={"sm"} margin={"auto"} p={1}>
        <Card
          sx={{
            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header do Profife */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              borderRadius: "32px 32px 0 0",
            }}
          >
            <MoreVertMenu options={["Editar", "Deletar"]} />
            <Avatar
              sx={{
                width: 110,
                height: 110,
                fontSize: 50,
                fontWeight: "bold",
                bgcolor: "primary.main",
                boxShadow: "0 8px 24px -6px rgba(33, 150, 243, 0.4)",
                mb: 1,
                border: "4px solid white",
              }}
            >
              {profile.name[0]}
            </Avatar>
          </Box>

          <Divider sx={{ mx: 4, opacity: 0.6 }} />

          {/* Lista de Atributos */}
          <Box sx={{ pt: 2, px: { xs: 0.5, md: 4 } }}>
            {Object.keys(profile).map((key) => {
              if (!(key in iconMapper)) return;

              return (
                <Box mb={1}>
                  <ProfileInfoItem label={key} value={profile[key]} />
                </Box>
              );
            })}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

function ProfileInfoItem({ label, value }) {
  const keyLower = label.toLowerCase();
  const Icon = iconMapper[keyLower] || User;

  // Formatação de data se a chave for DataCadastro
  const displayValue = keyLower.includes("created")
    ? new Date(value).toLocaleDateString("pt-BR", {
        second: "2-digit",
        minute: "2-digit",
        hour: "2-digit",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : value;

  // Capitalização do label
  const displayLabel =
    label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, " $1");

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: 1.5,
        borderRadius: 4,
        bgcolor: "white",
        border: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: 1,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateX(4px)",
          borderColor: "primary.light",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: "#e3f2fd",
          color: "primary.main",
          width: 40,
          height: 40,
          borderRadius: 2.5,
        }}
      >
        <Icon size={20} />
      </Avatar>
      <Box>
        <Typography
          variant="caption"
          color="text.disabled"
          fontWeight="bold"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {displayLabel}
        </Typography>
        <Typography variant="body1" fontWeight="600" color="text.primary">
          {displayValue}
        </Typography>
      </Box>
    </Paper>
  );
}
