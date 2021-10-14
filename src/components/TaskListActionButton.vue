<template>
    <el-button size="small" round>
        <strong>
            <!-- ce qu'on à mis dans le v-slot:text (ou #text) sera injecter dans le slot, si y'a rien le contenu par défaut ("Action") sera afficher  -->
            <slot name="text"></slot>
        </strong>

        <!-- contenu par défaut -->
        <slot>Action</slot>
    </el-button>
</template>

<script>
export default {

}
</script>

<style scoped>
strong {
    margin-right: 5px;
}
</style>