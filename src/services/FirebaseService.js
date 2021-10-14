import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCmNandMRv8FUEvxYCSU0avu4lznZl7Gkg",
    authDomain: "vue-tracker-devthe.firebaseapp.com",
    projectId: "vue-tracker-devthe",
    storageBucket: "vue-tracker-devthe.appspot.com",
    messagingSenderId: "368300907441",
    appId: "1:368300907441:web:1fa679c1cf5bc83591fb90"
};

// Initialisation de Firebase et Firebase Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const Auth = auth;

/* Exportations */
export async function register(email, password) {
    try 
    {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        return [res, null];
    } 
    catch (error) 
    {
        return [null, error.code];
    }
}

export async function login(email, password) {
    try 
    {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return [res, null];
    } 
    catch (error) 
    {
        return [null, error.code];
    }
}

export async function logout () {
    try 
    {
        await signOut(auth);
        return [true, null];
    } 
    catch (error) 
    {
        return [null, error.code];
    }
}

// Traduction des message d'érreur possible
const errorsTranslations = {
    'auth/email-already-in-use': 'L\'email indiqué est déjà lié à un compte existant',
    'auth/invalid-email': 'L\'email n\'a pas un bon format',
    'auth/operation-not-allowed': 'La connexion via email & mot de passe n\'est pas activée',
    'auth/weak-password': 'Le mot de passe est trop faible (moins de 6 caractères)',
    'auth/user-disabled': 'Le compte lié à cet email est désactivé',
    'auth/user-not-found': 'Le compte lié à cet email n\'existe pas',
    'auth/wrong-password': 'Le mot de passe ne correspond pas à ce compte'
}

export function translateErrorCode(errorCode) 
{
    if(errorsTranslations[errorCode])
        return errorsTranslations[errorCode]
    else
        return `Erreur inconnue, ${errorCode}`
}