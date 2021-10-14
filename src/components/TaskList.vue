<template>

	<el-select v-model="sortBy" placeholder="Ordre des tâches">
		<el-option label="La plus récente d'abord" value="descending"></el-option>
		<el-option label="La plus ancienne d'abord" value="ascending"></el-option>
	</el-select>

	<!-- Quand on boucle sur un objet la première valeur sera le contenu de la propriété et l'index sera le nom de la propriété -->
	<div v-for="(taskOfTheDay, taskIndex) in taskByDay" :key="taskIndex">
		<h3>{{ dateFormater.format(taskIndex) }}</h3>

		<el-table
			:data="taskOfTheDay"
			:row-class-name="checkHighlight"
			row-key="id"
			@row-click="setHighlight"
			empty-text="Aucune tâche"
			style="width: 100%"
			v-loading="areTasksLoading"
			:ref="taskIndex"
		>

		<el-table-column
			prop="name"
			sort-by="startTime"
			label="Tâche">
		</el-table-column>

		<el-table-column
			align="right"
			label="Début et fin"
			width="150">
			<template #header></template>      
			<template #default="scope">
			{{ formatTimestamp(scope.row.startTime)  }} - {{ formatTimestamp(scope.row.endTime) }}
			</template>
		</el-table-column>

		<el-table-column
			align="right"
			label="Durée"
			width="100">
			<template #header></template>
			<template #default="scope">
			{{ durationBetweenTimestamps(scope.row.startTime, scope.row.endTime) }}
			</template>
		</el-table-column>

		<el-table-column
			align="right"
			label="Actions"
			width="370">      
			<template #header></template>
			<template #default="scope">
			<TaskListActions
				:taskID="scope.row.id"
				:taskName="scope.row.name"
			/>
			</template>
		</el-table-column>

		</el-table>
	</div>

</template>

<script>
import TaskListActions from './TaskListActions.vue'
import { useTimestamp } from '../features/useTimestamp.js'
import { mapState, mapGetters } from 'vuex'

export default {
	components: {
		TaskListActions
	},
	data() {
		return {        
			defaultSortBy: 'descending',
			sortBy: (this.$route.query.sortBy === 'ascending') ? 'ascending' : 'descending'
		}
	},
	setup() {
		const { 
			durationBetweenTimestamps,
			formatTimestamp,
			dateFormater
		} = useTimestamp();

		return { 
			durationBetweenTimestamps,
			formatTimestamp,
			dateFormater
		}
	},
	watch: {
		sortBy(newVal) {
			this.$router.push({ query: { sortBy: newVal === this.defaultSortBy ? undefined : newVal } })
			this.sortTable()
		},
		taskByDay: {
			deep: true,
			handler() {
				this.$nextTick(() => {
					this.sortTable();
				})
			}
		}
	},
	computed: {
		...mapState({
			areTasksLoading: (state) => state.m_tasks.areTasksLoading
		}),
		...mapGetters({
			taskByDay: 'm_tasks/taskByDay'
		})
	},
	methods: {
		sortTable() {
			for (const timeStampOfTheTask in this.taskByDay) {
				console.log(timeStampOfTheTask);
				this.$refs[timeStampOfTheTask].sort('name', this.sortBy);
			}
		},
		checkHighlight({ row }) {
			if (this.$route.params.taskID && row.id === this.$route.params.taskID) {
				return 'highlight-line'
			} else {
				return ''
			}
		},
		setHighlight(row) {
			this.$router.push({ path: '/home/' + row.id })
		}
	},
	mounted () {
		this.sortTable()
	}
}
</script>

<style scoped>
.el-select {
  float: right;
}
h3 {
	text-align: left;
	text-transform: capitalize;
}
</style>