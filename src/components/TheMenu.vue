<template>
	<el-menu :router="true" :default-active="activeRoute">

		<el-menu-item index="/">
			<i class="el-icon-time"></i>
			<span>Tracker</span>
		</el-menu-item>

		<el-submenu index="/settings">
			<template #title>
				<i class="el-icon-setting"></i>
				<span>Paramètres</span>
			</template>
			
			<el-menu-item index="/settings/app">Application</el-menu-item>
			<el-menu-item index="/settings/user">Utilisateur</el-menu-item>
		</el-submenu>
		
	</el-menu>
</template>

<script setup>
/*
	Avec l'attribut "setup" on peut se passez du:  
		export default {
			setup()
			{
				// Code...

				return {

				}
			}
		}

	les variable seront automatiquement return et donc accéssible depuis le DOM, et pour les composant plus besoin du "component: { }"
*/
import { useRoute } from "vue-router"
import { computed } from "vue";

const route = useRoute();

const activeRoute = computed(() => {
	if (route.path == '/home') {
		return '/'
	} 
	else if(route.matched[0] && route.matched[0].path == '/') // Route enfant de /home
	{
		return '/'
	}
	else
	{
		return route.path
	}
})

// console.log(activeRoute);
</script>

<style scoped>
.el-menu {
  border-right: none !important;
  text-align: left;
  overflow-x: hidden;
}

h3 {
  text-align: center;
}
</style>