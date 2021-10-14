<template>
	<div>
		<h1>Page introuvable</h1>
		<h2 v-if="wrongPath">"{{ wrongPath }}"</h2>
		<el-button @click="previousPage" type="primary" round>
			Page d'accueil
		</el-button>
	</div>
</template>

<script>
import { reactive, toRefs } from "vue"
import { useRoute, useRouter } from "vue-router"

export default 
{
	setup() 
	{
		const route = useRoute();
		const router = useRouter();

		const state = reactive({
			wrongPath: route.params.wrongPath,
		})
		
		function previousPage() 
		{
			router.push('/');
		}

		return {
			...toRefs(state), // toRefs prend un objet reactif (Proxy) et transform chaque propriété en variable reactive classique (ex: const property1 = ref() )
			previousPage
		}
	}
}
</script>

<style lang="scss" scoped>

</style>