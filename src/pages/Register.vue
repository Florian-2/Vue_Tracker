<template>
    <div>
        <h1>Inscription</h1>
        <el-row>
            <el-col :span="16" :offset="4"> 
                <form action="/" method="get" @submit.prevent="sendForm">

            <!-- v-model="email" (v-model:modelValue="email") est égal à :modelValue="email" @update:modelValue="email = $event" -->
                <BaseInput 
                    label="Adresse email"
                    v-model="email" 
                    placeholder="hello@vuetracker.fr"
                    type="email"
                    id="email"
                    :aria-invalid="v$.email.$invalid"
                    aria-describedby="emailError"
                />
                <el-alert 
                    v-if="v$.email.$error" 
                    :title="v$.email.$errors[0].$message" 
                    type="error"
                    :closable="false"
                    id="emailError" 
                ></el-alert>

                <BaseInput 
                    label="Mot de passe"
                    v-model="password"
                    type="password" 
                    id="password" 
                    aria-describedby="passwordError"
                    :aria-invalid="v$.password.$invalid"
                />
                <el-alert 
                    v-if="v$.password.$error" 
                    :title="v$.password.$errors[0].$message"  
                    type="error"
                    :closable="false"
                    id="passwordError"
                ></el-alert>

                <BaseInput 
                    label="Confirmation du mot de passe"
                    v-model="passwordConfirm"
                    type="password" 
                    id="password-confirm"
                    aria-describedby="passwordConfirmError"
                    :aria-invalid="v$.password.$invalid"
                />
                <el-alert 
                    v-if="v$.passwordConfirm.$error" 
                    :title="v$.passwordConfirm.$errors[0].$message"  
                    type="error"
                    :closable="false"
                    id="passwordConfirmError"
                ></el-alert>
                
                <BaseCheckbox
                    v-model="termsOfUse"
                    id="termsOfUser"
                    aria-describedby="termeOfUseError" 
                    :aria-invalid="v$.termsOfUse.$invalid"
                >
                    Conditions d'utilisation
                </BaseCheckbox>
                <el-alert 
                    v-if="v$.termsOfUse.$error" 
                    :title="v$.termsOfUse.$errors[0].$message" 
                    type="error"
                    :closable="false"
                    id="termsOfUseError"
                ></el-alert>

                <div>
                    <el-button @click.prevent="sendForm" type="primary" native-type="submit" :loading="loading">Confirmer</el-button>
                    <el-alert 
                        v-if="apiError" 
                        :title="apiError" 
                        type="error"
                        :closable="false"
                        id="termsOfUseError"
                    ></el-alert>
                </div>

                </form>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import { reactive, toRefs, toRef, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core' // VueLidate
import { required, email, minLength, sameAsPassword, sameAsTrue } from '../utils/validator.js' // Les validateurs
import BaseInput from '../components/BaseInput.vue'
import BaseCheckbox from '../components/BaseCheckbox.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

/* 
    Explication Vuelidate / @blur

    Les erreur interviennent uniquement si $dirty vaut "true" ET que $invalide vaut "false", 
    ce qui veut dire que le champ en question doit avoir été toucher ou modifier (avant de lancer les vérification) et que la valeur du champ n'est pas correcte.

    @blur: Evenement qui indique quand on sort d'un champ

    $invalid: Savoir si un champ est invalide ou non (true-false)
    $dirty (locale): Indique si le champ en question a été toucher/modifier (true-false)
    $dity (globale): Indique si TOUT les champ du formulaire on été toucher.modifier (true-false)
    $error (locale): Indique si il y a une erreur sur le champ en question (true-false)
    $error (globale): Indique si il y a une erreur sur l'un des champ du formualaire (true-false)
    $errors (locale): Tableau contenant TOUTE les erreur concernant le champ en question (Array)
    $errors (globale): Tableau contenant TOUTE les erreur de TOUT les champ du formulaire (Array)

    Configuration dse rules: 
        Dans l'objet rules on peut créer nos propre validateur via une propriété qui contient une fonction qui prend en paramètre "value" qui correspond a la valeur du champ (ex: minLength: (value) => console.log(value.length > 10)


        $autoDirty (locale ou globale): Permet de se passez de l'event @blur, il va automatiquement passez $dirty a true ou false

*/

export default {
    components: {
        BaseInput,
        BaseCheckbox
    },
    setup() 
    {
        const router = useRouter();
        const store = useStore();

        const state = reactive({
            email: '',
            password: '',
            passwordConfirm: '',
            termsOfUse: false,
            loading: false,
            apiError: null
        })

        const rules = {
            email: {
                required, 
                email
            },
            password: {
                required,
                minLength: minLength(6)
            },
            passwordConfirm: {
                required,
                sameAsPassword: sameAsPassword(toRef(state, 'password'))
            },
            termsOfUse: {
                required,
                sameAsTrue
            }
        }

        const v$ = useVuelidate(rules, state, { $autoDirty: true });
        // console.log(v$);

        async function sendForm() {
            v$.value.$touch(); // passe le $dirty globale à true, pour éxécuter tout les validator
            state.apiError = null;

            if (!v$.value.$error) 
            {
                state.loading = true;   

                const res = await store.dispatch('m_user/register', { email: state.email, password: state.password });
                if (res === true) 
                    router.push('/settings/app');
                else
                    state.apiError = res;

                state.loading = false;
            }
        }

        // Ré-éxécution des validator de passwordConfirm si passwors a changer de valeur à change entre-temps
        watch(toRef(state, 'password'), () => 
        {
            if (v$.value.passwordConfirm.$dirty) 
            {
                v$.value.passwordConfirm.$reset();
                v$.value.passwordConfirm.$touch();
            }
        })

        return {
            ...toRefs(state),
            v$,
            sendForm
        }
    }
}
</script>

<style scoped>
form { 
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 4px;
    text-align: left;
}
.el-alert {
    margin: 10px 0;
    display: block;
    width: 70%;
}
.el-button {
    margin-top: 25px;
}
</style>