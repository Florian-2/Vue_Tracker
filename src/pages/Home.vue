<template>
	<div>
		<TaskList />
	</div>
</template>

<script>
import TaskList from '../components/TaskList.vue'

export default {
	components: {
		TaskList
	},
	emits: ['restart', 'delete'],
}
</script>
