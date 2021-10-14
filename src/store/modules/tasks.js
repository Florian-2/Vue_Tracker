import { v4 as uuid } from '@lukeed/uuid';
import * as TaskService from '../../services/TaskService.js';

export default {
    namespaced: true, // Précise que l'on doit indiquer dans quelle module est l'action (getter, mutation) qu'on souhaite récupérer (a faire au moment ou on appelle l'action, mutation etc... dans un fichier .vue) 
    state()
    {
        return {
            tasks: [], // Contient toute les tâches
            areTasksLoading: false, // Chargement du loader pendant la récupération des tâches via l'API

            /* Variable nécaissaire pour réprendre une tâche */
            currentTaskName: '', // Nom de la tâche
            currentStartTime: null, // Quand la tâche à t'elle commencer
            isTaskInProgress: false // Est-ce qu'une tâche est déjà en cour ?
        }
    },
    mutations: {
        SET_TASKS(state, tasks)
        {
            state.tasks = tasks;
        },
        SET_ARE_LOADING(state, bool)
        {
            state.areTasksLoading = bool;
        },
        ADD_TASK(state, newTask)
        {
            state.tasks.unshift(newTask);
        },
        DELETE_TASK(state, taskID)
        {
            state.tasks = state.tasks.filter(task => task.id !== taskID);
        },
        // Restart
        SET_CURRENT_TASKNAME(state, taskname)
        {
            state.currentTaskName = taskname;
        },
        SET_CURRENT_START_TIME(state, startTime)
        {
            state.currentStartTime = startTime;
        },
        SET_IS_TASK_IN_PROGRESS(state, bool)
        {
            state.isTaskInProgress = bool;
        }
    },
    actions: {
        async fetchAllTask({ commit, rootState })
        {
            // console.log(rootState.truc);

            try {
                commit('SET_ARE_LOADING', true);
                const allTasks = await TaskService.getAll();
                commit('SET_TASKS', allTasks); 
                commit('SET_ARE_LOADING', false);
            } catch (error) {
                commit('SET_ARE_LOADING', false);
                throw error;
            }
        },
        async updateAllTasks({ state })
        {
			await TaskService.updateAll(state.tasks);
        },
        startTask({ commit })
        {
            // Début (démarrage) de la tâche
            commit('SET_IS_TASK_IN_PROGRESS', true);
            commit('SET_CURRENT_START_TIME', Date.now());
        },
        stopTask({ commit, state })
        {
            // Enregistrement de la tâche
            const newTask = {
                id: uuid(),
				name: state.currentTaskName, 
				startTime: state.currentStartTime,
				endTime: Date.now()
            }
            commit('ADD_TASK', newTask);

			// Fin de la tâche
            commit('SET_IS_TASK_IN_PROGRESS', false);
            commit('SET_CURRENT_TASKNAME', '');
        },
        restartTask({ state, commit, dispatch }, newTaskName)
        {
            // Arrêt de la tâche en cours si besoin
			if (state.isTaskInProgress) 
                dispatch('stopStart');

            // Un setTimeout à 0 fera la même chose qu'on $nextTick, ici on à pas accès à $nextTick donc on utilise setTimeout
            setTimeout(() => {
                commit('SET_CURRENT_TASKNAME', newTaskName);
                dispatch('startTask');
            });
        }
    },
    getters: {
        // rootState, rootGetters sont aussi accéssible via un getters comme ici
        taskByDay(state, rootState, rootGetters)
        {
            if (state.tasks) 
            {
                const taskByDay = {}

                state.tasks.forEach(task => {
                    const currentDayTimeStamp = (new Date(task.startTime)).setHours(0, 0, 0, 0);
                    if (!taskByDay[currentDayTimeStamp]) {
                        taskByDay[currentDayTimeStamp] = [];
                    }
                    taskByDay[currentDayTimeStamp].push(task);
                });

                return taskByDay;
            }
            else 
            {
                return {}
            }
        }
    }
}