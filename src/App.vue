<template>
	<el-container class="mainContainer">
		<el-aside width="160px">
			<TheMenu />
		</el-aside>

		<el-container>
			<el-header height="60px">
                <!-- Ici ref fait référence au composant "TheTopTask", ducoup je peut accédez à toute ces méthode, propriété etc... -->
				<TheTopTask ref="ref_Of_TheTopTask" @new-task="addTask($event)"/>
			</el-header>

			<el-main>
				<TaskList :loading="loadingAPI" :tasks="taskList" @restart="sendRestartTask($event)" @delete="deleteTask($event)" />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import TheMenu from "./components/TheMenu.vue";
import TheTopTask from "./components/TheTopTask.vue";
import TaskList from "./components/TaskList.vue";
import { v4 as uuid } from '@lukeed/uuid';
import * as TaskService from './services/TaskService.js';

export default {
    components: {
        TheMenu,
        TheTopTask,
        TaskList,
    },
    data() {
        return {
            taskList: [], // Tableau contenant toute les tâches
            loadingAPI: true
        };
    },
    methods: {        
        async addTask(task) 
        {
            // Ajout d'une nouvelle tâche dans le tableau (local)
            this.taskList.unshift({id: uuid(), ...task, endTime: Date.now()});

            // Ajout d'une nouvelle tâche dans l'API
            await TaskService.updateTask(this.taskList);
            console.log(this.taskList);
            // console.log(task);
            // console.log(this.taskList);
        },
        async deleteTask(taskID)
        {
            // console.log(`Supprimer la tâche ${taskID}`);
            this.taskList = this.taskList.filter(task => task.id !== taskID);
            await TaskService.updateTask(this.taskList);
        },
        sendRestartTask(taskID)
        {
            // console.log(`La tâche ${taskID} est relancer`);
            const task = this.taskList.filter(task => task.id === taskID);
            this.$refs.ref_Of_TheTopTask.restartTask(task[0].name);
        },
        // Récupérer les tâches via l'API JSONBIN
        async getAllTask()
        {
            try {
                this.taskList = await TaskService.getAllTask();
            } catch (error) {
                console.log(error);
            }

            this.loadingAPI = false;
        }
    },
    created()
    {
        this.getAllTask();
    }
};
</script>

<style lang="scss">
body {
    margin: 0;
}
#app {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.mainContainer {
    height: 100%;
}

.el-aside {
    height: 100%;
    color: #333;
    border-right: solid 1px #e6e6e6;
}
.el-header {
    padding: 0 !important;
    border-bottom: solid 1px #e6e6e6;
    color: #333;
    line-height: 60px;

    .el-input .el-input__inner {
        border: none !important;
    }
}
</style>