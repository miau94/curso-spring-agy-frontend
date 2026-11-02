import { create } from 'zustand';
import { userService } from '../services/userService';
import type { Role, UserDto, UserRequestDto } from '../types/api';
import { useAuthStore } from './useAuthStore';

interface UserState {
  users: UserDto[];
  loading: boolean;
  searchEmail: string;
  roleFilter: 'ALL' | Role;
  setSearchEmail: (email: string) => void;
  setRoleFilter: (role: 'ALL' | Role) => void;
  fetchUsers: () => Promise<UserDto[]>;
  createUser: (payload: UserRequestDto) => Promise<UserDto>;
  updateUser: (id: number, payload: UserRequestDto) => Promise<UserDto>;
  deleteUser: (id: number) => Promise<void>;
}

// Deduplicación de peticiones concurrentes (client-swr-dedup)
let inflightUsersPromise: Promise<UserDto[]> | null = null;

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  searchEmail: '',
  roleFilter: 'ALL',

  setSearchEmail: (searchEmail) => set({ searchEmail }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),

  fetchUsers: async () => {
    if (inflightUsersPromise) {
      return inflightUsersPromise;
    }

    set({ loading: true });
    inflightUsersPromise = userService
      .getAll()
      .then((data) => {
        set({ users: data });
        return data;
      })
      .finally(() => {
        inflightUsersPromise = null;
        set({ loading: false });
      });

    return inflightUsersPromise;
  },

  createUser: async (payload) => {
    const created = await userService.create(payload);
    set((state) => ({ users: [...state.users, created] }));
    return created;
  },

  updateUser: async (id, payload) => {
    const updated = await userService.update(id, payload);
    set((state) => ({
      users: state.users.map((u) => (u.id === updated.id ? updated : u)),
    }));
    useAuthStore.getState().updateCurrentUserIfMatches(updated);
    return updated;
  },

  deleteUser: async (id) => {
    await userService.remove(id);
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
  },
}));
