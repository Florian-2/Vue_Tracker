<template>
    <el-row>
        <el-col :xs="12" :span="15" :lg="18">
            <el-input @keyup.enter="toggleTask" v-model="taskName" type="text" placeholder="Nom de votre tâche"></el-input>
            <!-- Affichage des erreurs provisoire -->
            <p v-if="errorMsg !== null" style="position: absolute; top: 20px; color: red">{{ errorMsg }}</p>
        </el-col>

        <el-col :xs="12" :span="9" :lg="6" class="actions">
            <strong>{{ currentDuration }}</strong>
            <!-- Btn démarrer -->
            <el-button v-if="!isTaskInProgress" @click="startTask" type="primary" icon="el-icon-video-play" circle></el-button>
            <!-- Btn arrêter -->
            <el-button v-else @click="stopTask" type="danger" icon="el-icon-video-pause" circle></el-button>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            taskName: "", // Le nom de la tâche (ce que es entrez dans le input)
            isTaskInProgress: false, // Est-ce qu'une tâche est en cours ?
            startTime: null, // La date de création de la tâche
            nowTime: null, // Chronomètre
            intervalEverySecond: null, // Rafraichissement du Date.now() pour le chronomètre dans un setInterval()
            errorMsg: null, // Message d'erreur possible
        };
    },
    computed: {
        /*
            Les méthodes de Vue.js sont appeler à chaque fois que vue fait un rendu contrairement au "computed" qui elle sont appeler uniquement si la (les) valeur qu'il à l'intérieur de cette fonction à été modifier -->
            Les computed sont des variable sous forme de méthode et elle sont appeler dans le DOM ou pour un événement
            Pas de "async et await" dans les computed properties
        */
        currentDuration() {
            if (this.startTime && this.nowTime)
                return this.durationBetweenTimestamp(this.startTime, this.nowTime);
            else 
                return "00:00:00";
        },
    },
    watch: {
        /* 
            Les watcher execute du code seulement si la variable (ici "isTaskInProgress") donnée à changer de valeur
            contrairement au "computed" les watcher n'ont pas pour objectif de retourner quelque chose et les watcher peuvent executer du code asynchrone pas les "computed"
            Les watcher peuvent prendre 2 paramètre, l'ancienne valeur et la nouvelle
        */
        isTaskInProgress(progress) {
            // Si un tâche à été commencer, on va démarrez le chronomètre SINON on clear le chronometre
            if (progress) {
                this.intervalEverySecond = setInterval(() => {
                    this.nowTime = Date.now();
                }, 1000);
            } else {
                clearInterval(this.intervalEverySecond);
            }
        },
    },
    methods: {
        startTask() {
            /* 
                Vérification : 
                    si le champ est vide on retourne une erreur,
                    si une tache est deja en cours on retourn une erreur
            */
            if (this.taskName.length === 0) {
                this.errorMsg = "Le nom de la tache ne peut pas etre vide";
                return;
            } else if (this.isTaskInProgress) {
                this.errorMsg = "Une tâche est déjà en cours";
                return;
            } else {
                this.errorMsg = null;
            }

            // Début de la tâche
            // Chronomètre
            this.isTaskInProgress = true;
            this.startTime = Date.now();
            this.nowTime = Date.now();
        },
        stopTask() {
            // Est-ce qu'une tâche est déjà en cours ?
            if (!this.isTaskInProgress) {
                this.errorMsg = "Aucune tâche n'est en cours";
                return;
            }

            // Envoie de la tache au composant parent App.vue
            this.$emit('new-task', {
                name: this.taskName,
                startTime: this.startTime,
            });

            // Fin de la tâche
            this.isTaskInProgress = false;
            this.errorMsg = null;
            this.nowTime = null;
            this.taskName = "";
        },
        toggleTask() {
            if (this.isTaskInProgress) 
                this.stopTask();
            else 
                this.startTask();
        },
        restartTask(newTaskName)
        {
            // Si une tâche est en cours on l'arrête
            if (this.isTaskInProgress) {
                this.stopTask();
            }

            // On relance la tâche
            // Le $nextTick sert à exécuter une fonction après que tout le traitement du dessus sois executer
            this.$nextTick(function() {
                this.taskName = newTaskName;
                this.startTask();
            });
        },
        durationBetweenTimestamp(start, end) 
        {
            let seconds = Math.floor(end / 1000 - start / 1000);
            let minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            seconds = seconds % 60;
            minutes = minutes % 60;
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        },
    }, 
};
</script>

<style lang="scss" scoped>
.el-input {
    margin-left: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.15);
}

.actions {
    text-align: right;
    padding-right: 20px;

    strong {
        padding-right: 20px;
    }
}
</style>