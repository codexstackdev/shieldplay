import { create } from "zustand"

type Role = "user" | "admin" | "tester";

type User = {
    _id:string;
    userName: string;
    profile: string;
    role: Role;
}

type Store = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}


const useSetuser =  create<Store>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    clearUser: () => set({user: null}),
}))


export default useSetuser;