/*
- Implement plurality vote
- Command line takes space separated list of names on the ballot, up to 9
- Ask for number of voters
- Prompt for a vote from each voter
- Do not allow names that are not a valid voter. 
- Tally the score and present winner, could be > 1
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
    const unique = new Set(candidates);

    if (candidates.length === 0) {
        console.log("You must enter at least one candidate.");
        return null;
    }
    if (candidates.length > 9) {
        console.log("You can enter at most 9 candidates.");
        return null;
    }
    if (unique.size !== candidates.length) {
        console.log("Candidate names must be unique.");
        return null;
    }

    return candidates;
}

function validateVoterAmount(input) {
    const number = Number(input);

    if (!Number.isInteger(number) || number < 1) {
        console.log("Voter count must be a whole number greater than 0.");
        return null;
    }

    return number;
}

function isValidCandidate(candidate, candidates) {
    return candidates.includes(candidate);
}

function getTopScorers(scoring) {
    return Object.values(scoring).reduce(
        ({ max, list }, curr) => {
            if (curr.score > max) {
                return { max: curr.score, list: [curr] };
            } else if (curr.score === max) {
                return { max, list: [...list, curr] };
            }
            return { max, list };
        },
        { max: -Infinity, list: [] }
    ).list;
}

async function runPluralityElection() {
    const candidates = await promptUntilValid(
        "Enter between 1 and 9 unique candidate names (space-separated): ",
        validateCandidates
    );

    const scoring = candidates.reduce((acc, name) => {
        const normalized = name.toLowerCase();
        acc[normalized] = { name, score: 0 };
        return acc;
    }, {});

    const voterCount = await promptUntilValid("Number of voters: ", validateVoterAmount);
    const validCandidates = Object.keys(scoring);

    for (let i = 0; i < voterCount;) {
        const vote = (await askQuestion("Vote: ")).trim().toLowerCase();

        if (isValidCandidate(vote, validCandidates)) {
            scoring[vote].score++;
            i++;
        } else {
            console.log(`"${vote}" is not a valid candidate.`);
        }
    }

    const winners = getTopScorers(scoring);
    console.log("\n Winner(s):");
    winners.forEach(({ name, score }) => {
        console.log(`- ${name} with ${score} vote(s)`);
    });

    rl.close();
}

runPluralityElection();
