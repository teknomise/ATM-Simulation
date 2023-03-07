const readline = require('readline');
const handleInput = require('./handleInput');

// initialize readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Display the prompt
rl.setPrompt('Enter command: ');

// Continuously listen for input
rl.on('line', (input) => {
    if(input === "exit"){
        rl.close();
        process.exit(1);
    }
    console.log('');
    handleInput(input);
    console.log('');
  rl.prompt();
 
});

// Welcome Message
console.log('#################################################');
console.log('');
console.log('Welcome to the simulation ATM Cli! Please log in.');
console.log('');
console.log('#################################################');
console.log('');

// Display the prompt when the script is first run
rl.prompt();