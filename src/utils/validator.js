// Les validateurs (required, email, minLength, sameAs, helpers etc...), pour accéder à un validateur il faut le faire de cette façon: Validators.email
import * as Validators from '@vuelidate/validators' 

const withMessage = Validators.helpers.withMessage;

// helper pour éventuellement utiliser: helper.regex, helper.req, helper.withMessage etc...
export const helper = Validators.helpers;

// Nos validators
export const required = withMessage("Ce champ est obligatoire", Validators.required);
export const email = withMessage("Format de l'adresse mail incorrect", Validators.email);
export const minLength = (min) => withMessage(`Le nombre de caractère minimum est de ${min}`, Validators.minLength(min));
// export const sameAs = (equalTo) => withMessage("Les deux mot de passe ne sont pas identiques", Validators.sameAs(equalTo));

export const sameAsPassword = (equalTo) => withMessage("Les deux mot de passe ne sont pas identiques", Validators.sameAs(equalTo));
export const sameAsTrue = withMessage("Cette case doit être cocher", Validators.sameAs(true));