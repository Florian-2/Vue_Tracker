<template>
	<TaskListActionButton @click="copyToClipboard(taskName)">
		<!-- Les "name slot (v-slot:)" -->
		<template #text>Copier</template>
		<i class="el-icon-document-copy"></i>  
	</TaskListActionButton>

	<TaskListActionButton @click="restartTask(taskName)" type="primary">
		<template #text>Relancer</template>
		<i class="el-icon-video-play"></i>
	</TaskListActionButton>

	<TaskListActionButton @click="DELETE_TASK(taskID)" type="danger">
		<template #text>Supprimer</template>
		<i class="el-icon-delete"></i>
	</TaskListActionButton>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import TaskListActionButton from './TaskListActionButton.vue'

export default {
	components: {
		TaskListActionButton
	},
	props: {
		taskID: {
			type: String,
			required: true
		},
		taskName: {
			type: String,
			required: true
		}
	},
	methods: {
		...mapMutations({
			DELETE_TASK: 'm_tasks/DELETE_TASK',
		}),
		...mapActions({
			restartTask: 'm_tasks/restartTask',
			sendSuccess: 'm_notif/sendSuccess'
		}),

		sendRestart () {
			this.$emit('restart', this.taskID)
		},
		copyToClipboard(text) {
			navigator.clipboard.writeText(text)
			.then(() => {
				this.sendSuccess({
					title: 'Succès',
					message: 'Le nom de cette tâche a bien été copié'
				});
			})
		}
	}
}
</script>

<style scoped>

</style>