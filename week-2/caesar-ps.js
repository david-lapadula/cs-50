/*
    - Write caesar cipher to encrypt a message
    - Must wrap around if key > 26
    - Must preserve case
    - Implementation
        - charCodeAt will get ASCII of value of string at index
        - get ASCII and minus 65/97 because that is start for A/a and will provide 0 - 25 range for letters
        - Add shift and use remainder to get wrap around because 27 will turn into 1
        - 26 modulo works because 0 - 25 has 26 indexes and the remainder produces the resultant index
        - Add 65/97 to get back to ASCII and then fromCharCode to get the letter
 */


const readline = require('readline');
const isPositiveNumber = require('../helpers')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function applyCaesar(key, plaintext) {
    const shift = Number(key);
    let result = '';

    for (let char of plaintext) {
        if (char >= 'A' && char <= 'Z') {
            result += String.fromCharCode((char.charCodeAt(0) - 65 + shift) % 26 + 65);
        } else if (char >= 'a' && char <= 'z') {
            result += String.fromCharCode((char.charCodeAt(0) - 97 + shift) % 26 + 97);
        } else {
            result += char; // Leave other characters as-is
        }
    }

    return result;
}


async function start() {
    let key;

    while (true) {
        key = await askQuestion("Enter a positive number: ");
        
        if (isPositiveNumber(key)) {
            break;
        }
        
        console.log("Invalid key. Please enter a number greater than 0.");
    }

    const plaintext = await askQuestion("Enter text to encrypt: ");
    let ciperText = applyCaesar(key, plaintext);

    console.log(ciperText);
    rl.close();
}

start();