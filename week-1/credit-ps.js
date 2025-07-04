/*
- Validate credit card numbers using a simple implementation of Luhn's algorithm
- modulo 10 congruent to 0, because in base 10 remainder after dividing by 10 is the last value
- AMEX: 34 or 37
- MASTERCARD: 51, 52, 53, 54, 55
- VISA: 4
 */


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptNumber() {
    rl.question("Input card number: ", function (cardNumber) {
        
        let ccType = getCCType(cardNumber);
        if (!ccType) {
            console.log("Please enter a VISA, MASTERCARD, or AMEX card number.");
            promptChange();
            return;
        }

        let isValidNumber = isValidCCNumber(cardNumber);
        if (!isValidNumber) {
            console.log("That is not a valid credit card number.");
            promptChange();
            return;
        }

        console.log("Valid credit card number.");
        rl.close();
    });
}

function isValidCCNumber(number) {
    const digits = number.toString().replace(/\D/g, ''); // Remove non-digit characters
    let sum = 0;
    let shouldDouble = false;

    // Loop through the digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9; // Same as summing the two digits highest can be 18
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;

}

function getCCType(cardNumber) {
    let firstTwoDigitsSlice = cardNumber.slice(0, 2);
    let firstDigit = Number(firstTwoDigitsSlice.slice(0, 1));
    let firstTwoDigits = Number(Number(firstTwoDigitsSlice));


    if (Number(firstDigit) === 4) {
        return "VISA";
    }

    if ([51, 52, 53, 54, 55].includes(Number(firstTwoDigits))) {
        return "MASTERCARD";
    }

    if ([34, 37].includes(Number(firstTwoDigits))) {
        return "AMEX";
    }

    return undefined;
}

promptNumber();


