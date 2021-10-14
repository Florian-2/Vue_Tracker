<template>
    <h2>Utilisateurs</h2>

    <div v-if="user !== null">
        <p>{{ user.email }}</p>
        <el-button @click="logout" type="danger" round>Déconnexion</el-button>
    </div>

</template>

<script>
import { computed } from 'vue'
import { useRouter } from "vue-router";
import { useStore } from "vuex"

export default {

    setup() 
    {
        const store = useStore();
        const router = useRouter();

        async function logout() 
        {
            const res = await store.dispatch('m_user/logout');

            if (res === true) router.push('/login')
            else {
                store.dispatch('m_notif/sendError', {
                    title: "La déconnexion à échoué",
                    message: res
                })
            }

        }

        return {
            logout,
            user: computed(() => store.state.m_user.currentUser)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>