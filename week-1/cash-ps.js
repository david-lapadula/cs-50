/*
- Use greedy algorithm to provide minimum number of coins as change for a certain amount of cents
- Input must be int greater than 0
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isPositiveNumber(value) {
    const num = Number(value);
    if (typeof num === 'number' && isFinite(num) && num > 0) {
        return num;
    }
    return null;
}

function promptChange() {
    rl.question("Change owed: ", function (height) {
        const validChange = isPositiveNumber(height);
        if (validChange) {
            let change = findChange(validChange);
            console.log(change);
            rl.close();
        } else {
            console.log("Please enter a valid number greater than 0.");
            promptChange();
        }
    });
}

function findChange(change) {
    // Coin denominations in cents
    const coins = [200, 100, 25, 10, 5, 1];
    let count = 0;

    for (let coin of coins) {
        count += Math.floor(change / coin); // Use as many of this coin as possible
        change %= coin; // Get the remaining change
    }

    return count;
}


promptChange();