<template>
        <!-- Copié le texte -->
    <el-button @click="sendCopyTaskName" icon="el-icon-document-copy" circle></el-button>
        <!-- Btn relancer une tâche -->
    <el-button @click="sendRestart" icon="el-icon-video-play" type="primary" circle></el-button>
        <!-- Btn supprimer une tâche -->
    <el-button @click="sendDelete" icon="el-icon-delete" type="danger" circle></el-button>			
</template>

<script>
export default {
    props: {
        taskID : {
            type: String,
            required: true
        }
    },
    emits: ['restart', 'delete', 'copyTaskName'],
    methods: {
        sendCopyTaskName()
        {
            this.$emit('copyTaskName');
        },
        sendRestart() {
            // console.log(this.taskID);
            this.$emit('restart', this.taskID);
		},
		sendDelete() {
            // console.log(this.taskID);
            this.$emit('delete', this.taskID);
		}
    }
}
</script>

<style lang="scss" scoped>

</style>