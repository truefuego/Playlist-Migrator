import { create } from "zustand";
import {devtools,persist} from 'zustand/middleware'

const SourceSinkStore = (set) => ({
    sourceType: null,
    sinkType: null,

    sourceAccessToken: null,
    sinkAccessToken: null,

    setSourceType: (source) => {
        set((state) => ({
            sourceType: source
        }))
    },

    removeSourceType: () => {
        set((state) => ({
            sourceType: null
        }))
    },

    setSourceAccessToken: (token) => {
        set((state) => ({
            sourceAccessToken: token
        }))
    },

    removeSourceAccessToken: () => {
        set((state) => ({
            sourceAccessToken: null
        }))
    },

    setSinkType: (sink) => {
        set((state) => ({
            sinkType: sink
        }))
    },

    removeSinkType: () => {
        set((state) => ({
            sinkType: null
        }))
    },

    setSinkAccessToken: (token) => {
        set((state) => ({
            sinkAccessToken: token
        }))
    },

    removeSinkAccessToken: () => {
        set((state) => ({
            sinkAccessToken: null
        }))
    },

    sourceUserID: null,
    sinkUserID: null,

    setSourceUserID: (id) => {
        set((state) => ({
            sourceUserID: id
        }))
    },

    removeSourceUserID: () => {
        set((state) => ({
            sourceUserID: null
        }))
    },

    setSinkUserID: (id) => {
        set((state) => ({
            sinkUserID: id
        }))
    },

    removeSinkUserID: () => {
        set((state) => ({
            sinkUserID: null
        }))
    },

    resetSourceSinkStore: () => {
        set((state) => ({
            sourceType: null,
            sinkType: null,
            sourceAccessToken: null,
            sinkAccessToken: null,
            sourceUserID: null,
            sinkUserID: null
        }))
    }
})

export const useSourceSinkStore = create(devtools(persist(SourceSinkStore,{name: 'userinfo'})))