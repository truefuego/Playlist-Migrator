import { create } from "zustand";
import {devtools,persist} from 'zustand/middleware'

const PlaylistsStore = (set) => ({
    pageIndex: 0,
    playlists: [],

    setPlaylists: (playlist) => {
        set((state) => ({
            playlists: playlist
        }))
    },

    goToPreviousPage: () => {
        set((state) => ({
            pageIndex: (--state.pageIndex + 5) % 5
        }))
    },

    goToNextPage: () => {
        set((state) => ({
            pageIndex: (++state.pageIndex) % 5
        }))
    },

    resetPlaylistStore: () => {
        set((state) => ({
            pageIndex: 0,
            playlists: []
        }))
    }

})

export const usePlaylistsStore = create(devtools(persist(PlaylistsStore,{name: 'playlists'})))