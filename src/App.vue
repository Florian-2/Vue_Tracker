<template>
	<el-container v-if="$route.meta.layout" class="mainContainer">

		<el-aside width="200px">
			<TheMenu />
		</el-aside>

		<el-container>
			<el-header height="60px">
				<TheTopTask
					ref="TheTopTask"
				/>
			</el-header>

			<el-main>

				<router-view></router-view>

			</el-main>
		</el-container>

	</el-container>

	<div v-else class="container">
		<h2 class="noLayout">VueTracker</h2>
		<router-view></router-view>
	</div>

</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import TheMenu from './components/TheMenu.vue'
import TheTopTask from './components/TheTopTask.vue'
import TaskList from './components/TaskList.vue'

export default {
	components: {
		TheMenu,
		TheTopTask,
		TaskList
	},
	computed: {
		...mapState({
			tasks: (state) => state.m_tasks.tasks
		}),
	},
	watch: {
		// Le "tasks" fait référence au "tasks" qu'on à appeller dans le ...mapState()
		tasks: {
			// Mise à jour de toutes les tâches en API dès que tasks change
			deep: true,
			async handler (newVal, oldVal) 
			{
				if (newVal !== null && oldVal !== null) 
				{          
					try {
						await this.updateAllTasks();
					} 
					catch (e) 
					{
						console.error(e);
						this.sendError({
							title: 'Mode hors-ligne',
							message: `Synchronisation des tâches impossible`,
						});
					}
				}
			}
		}
	},
	methods: {
		...mapActions({
			fetchAllTask: 'm_tasks/fetchAllTask',
			updateAllTasks: 'm_tasks/updateAllTasks',
			sendError: 'm_notif/sendError',
			setWatcherCurrentUser: 'm_user/setWatcherCurrentUser'
		}),
		...mapMutations({
			SET_NOTIFIER: 'm_notif/SET_NOTIFIER'
		})
	},
	async created () {

		// Récupération de l'utilisateur actuel
		this.setWatcherCurrentUser();

		// Notification
		/*
			Dans le module "notification.js" on à évidement pas accès à $notification,
			du coup on vas récupérez le this.$notification ou moment de la création de l'instance et l'envoyer à notre module pour qu'on puisse utiliser le $notification (qui est nommer this.notifier)
		*/
		this.SET_NOTIFIER(this.$notify);

		// Récupération de toutes les tâches
		try {
			await this.fetchAllTask();
		} catch (e) {
			console.error(e)
			this.sendError({
				title: 'Mode hors-ligne',
				message: `Récupération des tâches impossible`
			});
		}
	}
};
</script>

<style lang="scss">
body { margin: 0; }
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
.mainContainer { height: 100%; }

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
.el-notification {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.highlight-line {
  background-color: #40a0ff31 !important;
}
h2.noLayout {
	margin: 40px auto;
	text-decoration: underline;
}
</style>