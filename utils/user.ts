/**
     * Checks if a display name is valid for use.
     * @param displayName Display name.
     * @returns Whether the displayname is valid.
     */
export function validateDisplayName(displayName: any): boolean{
    return typeof displayName === "string" && displayName.length > 0; //TODO: Make this more advanced.
}

/**
 * Checks if a password satisifes the requirements to be secure.
 * @param passwd The password to check.
 * @returns Whether the password is sufficient.
 */
export function validatePassword(passwd: any): boolean {
    return (
        typeof passwd === "string" &&
        passwd.length > 8 && //Lower length bound
        passwd.length < 64 && //Upper length bound
        passwd.search(/[a-z]/) >= 0 && //Lowercase letters.
        passwd.search(/[A-Z]/) >= 0 && //Uppercase letters.
        passwd.search(/[0-9]/) >= 0 && //Numbers.
        !/^([a-z]|[A-Z]|[0-9])*$/.test(passwd as string) //Something other than just numbers and letters.
    )
}

/**
 * Validates an email address.
 * @param email The email address to validate.
 * @returns Whether the email is valid or not.
 */
export function validateEmail(email: any): boolean {
    let emailRegex = /* Source: http://emailregex.com/ */ /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return typeof email === "string" && emailRegex.test(email);
}