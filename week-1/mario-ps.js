/*
Easy Version
  - Create a right aligned pyramid like
        #
       ##
      ###
Hard Version
  - Create a gap pyramid like this
       #  #
      ##  ##
     ###  ###
    ####  ####
- Prompt user for int to determine height
- Validate input
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


function promptHeight() {
  rl.question("Select a height for your pyramid? ", function(height) {
    const validHeight = isPositiveNumber(height);
    if (validHeight) {
      // rightAlignedPyramid(validHeight);
      gapPyramid(validHeight);
      rl.close();
    } else {
      console.log("Please enter a valid number greater than 0.");
      promptHeight();  
    }
  });
}



function gapPyramid(height) {
  if (!(height % 2 === 0)) {
    height++;
  }

  for (let i = 1; i <= height; i++) {10
    let width = (height * 2) + 2;
    let line = '';
    for (let j = 1; j <= width; j++) {
      let half = width / 2;
      let printLeft = j < half && j >= height - (i - 1);
      let printRight = j > half + 1 && j < half + 2 + i;
      if (printLeft || printRight) {
        line += '#'
      } else {
        line += ' ';
      }
    }
    console.log(line);
  }
}

function rightAlignedPyramid(height) {
  for (let i = 1; i <= height; i++) {
    let line = '';
    for (let j = 1; j <= height; j++) {
      if (j > height - i) {
        line += '#';
      } else {
        line += ' ';
      }
    }
    console.log(line);
  }
}
promptHeight();

