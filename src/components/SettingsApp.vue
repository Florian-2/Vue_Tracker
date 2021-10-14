<template>
	<h2>Application (Composition API)</h2>
	<el-row>
		<el-col :offset="6" :span="12">
			<p>Clé secrète de votre API JSONbin.io :</p>
			<el-input placeholder="API KEY" v-model="inputValueJsonBinKey"></el-input>

			<p>ID de votre bin :</p>
			<el-input placeholder="BIN ID" v-model="inputValueJsonBinID"></el-input>

			<el-button type="primary" @click="updateApiValues" :loading="areNewValuesBeingTested">Confirmer</el-button>
		</el-col>
	</el-row>
</template>

<script>
import { ref, watch } from 'vue'
import { updateAxiosInstance } from '../services/TaskService.js'
import { mapActions, useStore } from 'vuex'

export default {   

    setup(props, context) // setup = beforeCreated() + created()
    {
		const store = useStore();

        let inputValueJsonBinKey = ref(localStorage.getItem('jsonBinKey') || '');
        let inputValueJsonBinID = ref(localStorage.getItem('jsonBinID') || '');
		let isAPIConnected = ref(localStorage.getItem('jsonBinAccess') || false);
        const areNewValuesBeingTested = ref(false);

		watch(isAPIConnected, (newValue) => {
			if (newValue) {
				localStorage.setItem('jsonBinAccess', true);
			} else {
				localStorage.removeItem('jsonBinAccess');
			}
		})

        const updateApiValues = async function() {
            // console.log(areNewValuesBeingTested); RefImpl { _rawValue: false, _shallow: false, __v_isRef: true, _value: false }
            // Mise à jour des valeurs de JSONBin.io
			areNewValuesBeingTested.value = true

			if (inputValueJsonBinKey.value !== '') {
				localStorage.setItem('jsonBinKey', inputValueJsonBinKey.value)
			} else {
				localStorage.removeItem('jsonBinKey')
			}
			if (inputValueJsonBinID.value !== '') {
				localStorage.setItem('jsonBinID', inputValueJsonBinID.value)
			} else {
				localStorage.removeItem('jsonBinID')
			}

			updateAxiosInstance();

			try {
				/* 
					On appelle fetchAllTask() pour savoir si la clé d'API est correct,  
					si elle n'est pas bonne la fonction fetch va retourné une erreur est on passera dans le catch()
				*/
				await store.dispatch('m_tasks/fetchAllTask');
				isAPIConnected.value = true
				localStorage.setItem('jsonBinAccess', true);
				store.dispatch('m_notif/sendSuccess', {
					title: 'Succès',
					message: `Vos clés sont enregistrés dans ce navigateur`
				})
			} catch(e) {
				isAPIConnected.value = false;
				store.dispatch('m_notif/sendError', {
					title: 'Erreur',
					message: `Cette combinaison de fonctionne pas sur JSONBin.io`
				})
			}
			areNewValuesBeingTested.value = false;
        }

        return {
            // Variables
            inputValueJsonBinKey,
            inputValueJsonBinID,
            areNewValuesBeingTested,

            // Méthodes
            updateApiValues
        }
    },

	methods: {
		...mapActions({
			fetchAllTask: 'm_tasks/fetchAllTask',
			sendError: 'm_notif/sendError',
			sendSuccess: 'm_notif/sendSuccess'
		})
	}
}
</script>

<style lang="scss" scoped>
p { text-align: left; }
.el-button {
  margin-top: 20px;
}
</style>