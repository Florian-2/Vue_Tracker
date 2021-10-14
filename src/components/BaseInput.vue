<template>
    <div class="form-control">
        <label :for="id">{{ label }}</label>
        <input 
            :value="modelValue" 
            @input="$emit('update:modelValue', $event.target.value)"
            :id="id"
            v-bind="$attrs"
        />
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: false
        },
        modelValue: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue']
}
</script>

<style scoped>
.form-control input {
    margin: 10px 0px;
    display: block;
    width: 90%;
    height: 25px;
    padding: 5px;
    border: 2px solid rgba(128, 128, 128, 0.10);
    border-radius: 5px;
}
</style>