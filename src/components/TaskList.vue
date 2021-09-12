<template>
	<!-- 
		:data = Doit faire référence à un tableau contenant des objet, il va parcourir le tableau comme une boucle for()
		prop = Affiche les élément du tableau sur le quel on vient de boucler grâce à "data" (ex: prop="prenom", on affiche le contenu de la proriété "prenom" qui est dans un objet qui fait partie du tableau)
		row-key = C'est l'équivalent de :key pour une boucle for, donc donne une key pour chaque ligne générer
		empty-text = Affichera sont contenu si le tableau est vide

		Les Slot, tout les attribut avec des # sont des slots
		scope.$index, scope.row = Le premier fait référence à l'index de la ligne et le secont contient l'objet avec les propriété concernant cette ligne, les .$index et row est disponible que dans les slot par defaut (#default="scope")

	-->
	<el-table
		v-loading="loading"
		:data="tasks"
		row-key="id"
		empty-text="Aucune tâche"
		stripe
		style="width: 100%">

		<el-table-column
			prop="name"
			label="Tâche">
		</el-table-column>

		<el-table-column
			align="right"
			label="Début et fin"
			width="150"
		>

			<template #header></template>
			<template #default="scope">
				{{ formatTimestamp(scope.row.startTime) }} - {{ formatTimestamp(scope.row.endTime) }}
			</template>

		</el-table-column>

		<el-table-column
			align="right"
			label="Durée"
			width="100"
		>

			<template #header></template>
			<template #default="scope">
				{{ durationBetweenTimestamp(scope.row.startTime, scope.row.endTime) }}
			</template>
		
		</el-table-column>

		<el-table-column align="right" label="Actions" width="200">
			<template #header></template>
			<template #default="scope">
				<!-- {{ scope.$index }} -->
				<!-- {{ scope.row.id }} -->
				<btns-actions 
					:taskID="scope.row.id" 
					@restart="sendRestart($event)"
					@delete="sendDelete($event)" 
					@copyTaskName="copyToClipboard(scope.row.name)"
				/>
			</template>
		</el-table-column>
		
	</el-table>
</template>

<script>
import TaskListActions from './TaskListActions.vue';

export default {
	data() {
		return {
			tsFormatter: Intl.DateTimeFormat('fr', { hour: '2-digit', minute: '2-digit' }),
		}
	},
	components: {
		'btns-actions' : TaskListActions
	},
	props: {
		// On récupère un tableau depuis le composant App.vue
		tasks: {
			type: Array,
			default: []
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		sendRestart(taskID)
		{
			console.log(taskID);
			this.$emit('restart', taskID);
		},
		sendDelete(taskID)
		{
			console.log(taskID);
			this.$emit('delete', taskID);
		},
		copyToClipboard(taskName)
		{
			navigator.clipboard.writeText(taskName);
		},
		formatTimestamp(timestamp)
		{
			return this.tsFormatter.format(timestamp);
		},
		durationBetweenTimestamp(start, end)
		{
			let seconds = Math.floor((end / 1000) - (start / 1000));
			let minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			seconds = seconds % 60;
			minutes = minutes % 60;
			return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
		}
	}
}
</script>