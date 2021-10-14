<template>
	<el-row>
		<el-col :xs="12" :span="15" :lg="18">
			<el-input @keyup.enter="toggleTask" v-model="taskName" placeholder="Nom de votre tâche"></el-input>
		</el-col>

		<el-col :xs="12" :span="9" :lg="6" class="actions">
			<strong>{{ currentDuration }}</strong>
			<el-button v-if="!isTaskInProgress" @click="beforeStartTask" type="primary" icon="el-icon-video-play" circle></el-button>
			<el-button v-else @click="beforeStopTask" type="danger" icon="el-icon-video-pause" circle></el-button>
		</el-col>
	</el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { useTimestamp } from '../features/useTimestamp.js'

export default {
	data() {
		return {
			nowTime: null,
			intervalEverySecond: null,
			errorMsg: null
		}
	},
	setup() {
		const { durationBetweenTimestamps }	= useTimestamp();
		return { durationBetweenTimestamps }
	},
	computed: {
		...mapState({
			startTime: (state) => state.m_tasks.currentStartTime,
			isTaskInProgress: (state) => state.m_tasks.isTaskInProgress
		}),

		taskName: {
			get()
			{
				return this.$store.state.m_tasks.currentTaskName;
			},
			set(newValueInput) // 'newValueInput' contient la valeur de 'currentTaskName'
			{
				this.$store.commit('m_tasks/SET_CURRENT_TASKNAME', newValueInput);
			}
		},

		currentDuration () {
			if (this.startTime && this.nowTime) {
				return this.durationBetweenTimestamps(this.startTime, this.nowTime)
			} else {
				return '00:00:00'
			}
		}
	},
	watch: {
		isTaskInProgress (isInProgress) {
			if (isInProgress) 
			{
				this.nowTime = Date.now();
				this.intervalEverySecond = setInterval(() => {
					this.nowTime = Date.now()
				}, 1000)
			} 
			else
			{
				this.errorMsg = null;
				this.nowTime = null;
				clearInterval(this.intervalEverySecond)
			}
		},
		errorMsg (newVal) {
			// Notification en cas d'erreur
			if (newVal !== null) 
			{
				this.sendWarning({
					title: 'Attention',
					message: this.errorMsg,
				})
				this.errorMsg = null;
			}
		}
	},
	methods: {
		...mapActions({
			startTask: 'm_tasks/startTask',
			stopTask: 'm_tasks/stopTask',
			sendWarning: 'm_notif/sendWarning'
		}),

		beforeStartTask () {
			// Vérifications
			if (this.taskName.length === 0) {
				this.errorMsg = "Le nom d'une tâche ne peut pas être vide";
				return
			} else if (this.isTaskInProgress) {
				this.errorMsg = 'Une tâche est déjà en cours';
				return
			} else {
				this.errorMsg = null;
			}

			// Début de la tâche
			this.startTask();
		},
		beforeStopTask() 
		{
			// Vérifications
			if (!this.isTaskInProgress) {
				this.errorMsg = "Aucune tâche n'est en cours"
				return
			}

			// Envoie de la nouvelle tâche à ajouter
			this.stopTask();
		},
		toggleTask() 
		{
			if (this.isTaskInProgress) 
				this.beforeStopTask();
			else 
				this.beforeStartTask();
		}
	}
}
</script>

<style lang="scss" scoped>
.el-input {
  padding-left: 20px;
  box-sizing: border-box;
}

.actions {
  text-align: right;
  padding-right: 20px;
  strong {
    padding-right: 20px;
  }
}
</style>