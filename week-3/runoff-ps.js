/*
- Any candidate with > 50% of first place wins automatically
- If not, candidate with fewest first place votes eliminated and anyone who chose them has their second choice entered
- Simulates what happens if the least popular was never there
- Still need to handle ties
- Should solve ties
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

function createVoteCount(voterCount) {
    return Object.fromEntries(
        Array.from({ length: voterCount }, (_, i) => [i + 1, 0])
    );
}

function validateVoterAmount(input) {
    const number = Number(input);

    if (!Number.isInteger(number) || number < 1) {
        console.log("Voter count must be a whole number greater than 0.");
        return null;
    }

    return number;
}

function validateCandidateForRound(candidate, candidates, roundVotes) {
    ;
    if (!candidates.includes(candidate)) {
        console.log("That is not a valid candidate.");
        return null;
    }
    if (roundVotes.includes(candidate)) {
        console.log("You cannot select the same candidate twice.");
        return null;
    }

    return candidate;
}

async function collectVotes(voterCount, candidates) {
    let rankedVote = [];

    for (let i = 0; i < voterCount; i++) {
        let roundVotes = [];

        for (let j = 0; j < candidates.length; j++) {
            let rank = j + 1;

            const vote = await promptUntilValid(
                `Rank ${rank}:`,
                (input) => validateCandidateForRound(input, candidates, roundVotes)
            );

            roundVotes.push(vote);
        }
        rankedVote.push(roundVotes);
        console.log("\n");
    }


    return rankedVote;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateWinner(voterCount, rankedVote) {
    let halfTotalVotes = Math.ceil(voterCount / 2);
    let voteTotal = Object.fromEntries(
        Array.from(rankedVote[0], name => [name, 0])
    );
    let eliminated = [];
    let winner;
    let i = 0;

    while (i < rankedVote.length) {
        let ballot = rankedVote[i];
        let j = 0;
        let topVote;

        while (j < ballot.length) {
            if (!eliminated.includes(ballot[j])) {
                topVote = ballot[j];
                break;
            }
            j++;
        }

        voteTotal[topVote]++;

        if (i === rankedVote.length - 1) {
            const sorted = Object.entries(voteTotal)
                .sort((a, b) => b[1] - a[1]);

            const topScore = sorted[0][1];

            if (topScore >= halfTotalVotes) {
                winner = sorted[0][0];
                break;
            } else {
                const lowestScore = sorted[sorted.length - 1][0];
                eliminated.push(lowestScore);
                const indexOfLowest = rankedVote[0].indexOf(lowestScore);
                const newArr = [...rankedVote[0].slice(0, indexOfLowest), ...rankedVote[0].slice(indexOfLowest + 1)];
                voteTotal = Object.fromEntries(
                    Array.from(newArr, name => [name, 0])
                );
                i = 0;
            }

        } else {
            i++;
        }

    }

    return winner;
};

function calculateWinner1(ballots) {
    let candidates = new Set(ballots[0]); // initial candidates
    const majority = Math.ceil(ballots.length / 2);

    while (true) {
        // Tally first-place votes
        const counts = {};
        for (let c of candidates) counts[c] = 0;

        for (let ballot of ballots) {
            const top = ballot.find(c => candidates.has(c)); // find the first one
            if (top) counts[top]++;
        }

        // Check for winner
        for (let [cand, count] of Object.entries(counts)) {
            if (count > majority) return cand;
        }

        // Find minimum vote(s)
        let minCount = Math.min(...Object.values(counts));
        let lowest = Object.keys(counts).filter(c => counts[c] === minCount);

        if (lowest.length === candidates.size) {
            return "Tie between: " + [...candidates].join(", ");
        }

        // Eliminate lowest
        lowest.forEach(c => candidates.delete(c));

        if (candidates.size === 0) {
            return "No winner";
        }
    }
}


async function runRunoffElection() {
    const candidates = await promptUntilValid(
        "Enter between 1 and 5 unique candidate names (space-separated): ",
        validateCandidates
    );

    const candidateMap = Object.fromEntries(
        Array.from(candidates, name => [name.toLowerCase(), name])
    );

    const voterCount = await promptUntilValid("Number of voters: ", validateVoterAmount);
    const rankedVote = await collectVotes(voterCount, Object.keys(candidateMap));
    const winner = calculateWinner(voterCount, rankedVote);

    rl.close();
}



let winner = calculateWinner(7, [
    ['alice', 'bob', 'carol'],
    ['alice', 'carol', 'bob'],
    ['alice', 'carol', 'bob'],
    ['bob', 'alice', 'carol'],
    ['bob', 'alice', 'carol'],
    ['bob', 'alice', 'carol'],
    ['carol', 'alice', 'carol'],
]
);

let winner2 = calculateWinner1([
    ['alice', 'bob', 'carol'],
    ['alice', 'carol', 'bob'],
    ['alice', 'carol', 'bob'],
    ['bob', 'alice', 'carol'],
    ['bob', 'alice', 'carol'],
    ['carol', 'alice', 'carol'],
    ['carol', 'alice', 'carol'],
]
)

console.log("winner:" + winner2);

// runRunoffElection();