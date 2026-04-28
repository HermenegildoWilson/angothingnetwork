import { api } from "@/config/api/api";
import type {
  GenerateRegisterTokenDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from "./types";
import type CreateUserDto from "./types";
import type { functionDefaultReturn } from "@/types/functionDefaultReturn";

const generateRegisterToken = async (
  data: GenerateRegisterTokenDto,
): Promise<functionDefaultReturn<{ message?: "" }>> => {
  try {
    const response = await api.post("/user/register", data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      ...(error.response?.data || error),
    };
  }
};

const create = async (data: CreateUserDto) => {
  try {
    const response = await api.post("/user", data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      ...(error.response?.data || error),
    };
  }
};

const find = {
  one: async (id: string) => {
    try {
      const response = await api.get(`/user/${id}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        ...(error.response?.data || error),
      };
    }
  },
  all: async () => {
    try {
      const response = await api.get(`/user`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        ...(error.response?.data || error),
      };
    }
  },
};

const update = {
  profile: async (props: { id: string; data: UpdateUserDto }) => {
    const { data, id } = props;
    try {
      const response = await api.patch(`/user/${id}`, data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        ...(error.response?.data || error),
      };
    }
  },
  password: async (props: { id: string; data: UpdateUserPasswordDto }) => {
    const { data, id } = props;
    try {
      const response = await api.patch(`/user/password/${id}`, data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        ...(error.response?.data || error),
      };
    }
  },
};

export const userService = {
  generateRegisterToken,
  create,
  find,
  update,
};
