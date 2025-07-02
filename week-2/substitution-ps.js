/*
    - Substitution should accept a key
    - Key is case insensitive
    - Key should have 26 letters, all alphabetical, and no duplicates
    - Accept first the key then the plaintext and print the ciphertext
 */
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function validateKey(key) {
    if (!key || new Set(key).size !== 26) {
        return [false, "The key must be exactly 26 unique letters"];
    }

    for (const char of key) {
        if (!/^[a-zA-Z]$/.test(char)) {
            return [false, "The key only contain letters of the alphabet"];
        }
    }

    return [true, null];
}

function applyCipher(plaintext, key) {
    let textArray = plaintext.split("");
    let keyArray = key.toUpperCase().split("");
    let ciphertext = "";

    for (const char of textArray) {
         if (char >= 'A' && char <= 'Z') {
            let index = char.charCodeAt(0) - 65;
            ciphertext += keyArray[index].toUpperCase();
        } else if (char >= 'a' && char <= 'z') {
            let index = char.charCodeAt(0) - 97;
            ciphertext += keyArray[index].toLowerCase();
        } else {
            ciphertext += char;
        }
    }

    return ciphertext;
}



async function start() {
    let key;

    while (true) {
        key = await askQuestion("Enter the key: ");
        let [isValidKey, errorMessage] = validateKey(key);

        if (isValidKey) {
            break;
        }

        console.log(errorMessage);
    }

    const plaintext = await askQuestion("Plaintext: ");
    let cipherText = applyCipher(plaintext, key);
    console.log("Ciphertext:" + cipherText);

    rl.close();
}

start();