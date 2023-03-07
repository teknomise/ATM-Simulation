// import classes
const CoreClass = require('./classes/CoreClass');
const MessageHandlerClass = require('./classes/MessageHandlerClass');

// initialize message handler
const messageHandler = new MessageHandlerClass();
let isLoggedIn = false;


// handle Input Function
const handleInput = (input)  => {

    const [command, ...args] = input.trim().split(' ');

    try {
      switch (command) {
          case 'login' || 'Login':
              let name = args[0];
          
              if (isLoggedIn && name) {
                  console.log(messageHandler.otherInfo(1001));
              } else if (name) {
                  console.log(messageHandler.login(name));
              } else {
                  console.log(messageHandler.otherInfo(1002));
              }
  
              isLoggedIn = name ? true : false;
  
          break;
          case 'deposit' || 'Deposit':
              const amount = Number(args[0]);
              if (isLoggedIn && amount) {
                  console.log(messageHandler.deposit(amount));
              } else if (!isLoggedIn) {
                  console.log(messageHandler.otherInfo(1003));
              } else {
                  console.log(messageHandler.otherInfo(1004));
              }
  
          break;
          case 'withdraw' || 'Withdraw':
              const withdrawAmount = Number(args[0]);
              if (isLoggedIn && withdrawAmount) {
                  try {
                    console.log(messageHandler.withdraw(withdrawAmount));
                  } catch (error) {
                    console.log(error.message);
                  }
              } else if (!isLoggedIn) {
                  console.log(messageHandler.otherInfo(1005));
              } else {
                  console.log(messageHandler.otherInfo(1004));
              }
  
          break;
          case 'transfer' || 'Transfer':
              const targetName = args[0];
              const transferAmount = args[1];
              if (isLoggedIn && targetName && transferAmount) {
                  try {
                      const target = new CoreClass(targetName);
                      console.log(messageHandler.transfer(target, Number(transferAmount)));
                  } catch (error) {
                    console.log(error.message);
                  }
              } else if (!isLoggedIn) {
                  console.log(messageHandler.otherInfo(1006));
              } else {
                  console.log(messageHandler.otherInfo(1007));
              }
  
          break;
          case 'check' || 'Check':
              if (isLoggedIn) {
                  console.log(messageHandler.check());
              } else {
                  console.log(messageHandler.otherInfo(1008));
              }
          break;
          case 'logout' || 'Logout':
  
              if (!isLoggedIn) {
                  console.log(messageHandler.otherInfo(1001));
              } else {
                  console.log(messageHandler.getLogoutInfo());
                  isLoggedIn = false;
              }
  
          break;
          case 'help' || 'Help':
              console.log('Available commands:\n');
              console.log('  login <name>      Log in with the given name');
              console.log('  deposit <amount>  Deposit the given amount');
              console.log('  withdraw <amount> Withdraw the given amount');
              console.log('  transfer <target name> <amount> Transfer the given amount to the given user');
              console.log('  help              Display this list of available commands');
              console.log('  exit              Exit from Cli console');
          break;
        
          default:
              console.log(messageHandler.otherInfo());
          break;
       
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports = handleInput