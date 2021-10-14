import { v4 as uuid } from '@lukeed/uuid';

export default {
    namespaced: true,
    state()
    {
        return {
            history: [],
            notifier: null
        }
    },
    mutations: {
        SET_NOTIFIER(state, value)
        {
            state.notifier = value;
        },
        ADD_NOTIFICATION(state, newNotification)
        {
            state.history.push(newNotification);
        }
    },
    actions: {
        saveNotification({ commit }, notif)
        {
            commit('ADD_NOTIFICATION', {
                id: uuid(),
                startTime: Date.now(),
                notif
            })
        },        
        
        /**
         * @param  {} { state, dispatch }
         * @param  {} { type, message, title, etc... }
         */
        sendCustom({ state, dispatch }, options)
        {
            const notif = state.notifier({
                offset: 50,
                duration: 3000,
                ...options
            });

            dispatch('saveNotification', notif);
        },
        sendSuccess({ dispatch }, options)
        {
            dispatch('sendCustom', {
                type: 'success',
                ...options
            });
        },
        sendError({ dispatch }, options)
        {
            dispatch('sendCustom', {
                type: 'error',
                ...options
            });
        },
        sendWarning({ dispatch }, options)
        {
            dispatch('sendCustom', {
                type: 'warning',
                ...options
            });
        }
    }
}