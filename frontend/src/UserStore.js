import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'

export const useUserStore = create(
    persist(
        (set,) =>
        ({
            user: null,
            setUser: (item) => set(() => ({ user: item }))
        }),
        {
            name: 'socialMediaApp', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ))