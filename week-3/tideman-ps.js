/*

*/

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function promptUntilValid(prompt, validator) {
    while (true) {
        const input = (await askQuestion(prompt)).trim();
        const result = validator(input);
        if (result !== null) return result;
    }
}

function validateCandidates(input) {
    const candidates = input.split(/\s+/);

    if (candidates.length === 0) {
        console.log("You must enter at least one candidate.");
        return null;
    }
    if (candidates.length > 5) {
        console.log("You can enter at most 5 candidates.");
        return null;
    }

    const unique = new Set(candidates.map(name => name.toLowerCase()));

    if (unique.size !== candidates.length) {
        console.log("Candidate names must be unique.");
        return null;
    }

    return candidates;
}


async function tidemanElection() {
    const candidates = await promptUntilValid(
        "Enter between 1 and 5 unique candidate names (space-separated): ",
        validateCandidates
    );

    console.log(candidates)

    rl.close();
}



tidemanElection();