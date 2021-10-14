<template>
    <input 
        type="checkbox" 
        :id="id"
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.checked)"
        v-bind="$attrs"
    >
    <label :for="id">
        <slot></slot>
    </label>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        modelValue: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:modelValue']
}
</script>

<style scoped>
input {
    margin: 25px 0 0;
}
</style>