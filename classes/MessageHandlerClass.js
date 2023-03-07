/*******************************************************************
  Class for handling user messages and performing banking operations
*******************************************************************/

const CoreClass = require('./CoreClass');

class MessageHandlerClass {
  
    constructor() {
      this.users = {};
      this.currentUser = null;
    }
  
    login(name) {

      if (name in this.users) {
        this.currentUser = this.users[name];
      } else {
        this.currentUser = new CoreClass(name);
        this.users[name] = this.currentUser;
      }

      if(this.currentUser.owedFromValue && this.currentUser.owedFromValue > 0){
        return `Hello, ${name}! \nYour balance is ${this.currentUser.balance} \nOwed $${this.currentUser.owedFromValue} from ${this.currentUser.owedFromName}`;
      } else if(this.currentUser.owedToValue && this.currentUser.owedToValue > 0){
        return `Hello, ${name}! \nYour balance is ${this.currentUser.balance} \nOwed $${this.currentUser.owedToValue} to ${this.currentUser.owedToName}`;
      } else {
        return `Hello, ${name}! \nYour balance is ${this.currentUser.balance}`;
      }
    }
  
    logout() {
      this.currentUser = null;
    }
  
    deposit(amount) {

      this.currentUser.deposit(amount, this.users);
      
      let res = null;

      switch (this.currentUser.depositModel) {
        case 'debt-paid':
          res = `Transferred $${this.currentUser.transferValue} to ${this.currentUser.owedToName} \nYour balance is $${this.currentUser.balance}\nOwed $0`;
          this.currentUser.owedToName = "";
        break;
        case 'still-have-debt':
          res = `Transferred $${this.currentUser.transferValue} to ${this.currentUser.owedToName} \nYour balance is $${this.currentUser.balance} \nOwed $${this.currentUser.owedToValue} to ${this.currentUser.owedToName}`;
        break;
        case 'debt-paid-have-balance':
          res = `Transferred $${this.currentUser.transferValue} to ${this.currentUser.owedToName} \nYour balance is $${this.currentUser.balance}`;
          this.currentUser.owedToName = "";
        break;
        default:
          res = `Your balance is $${this.currentUser.balance}`;
          break;
      }

      return res;
    }
  
    withdraw(amount) {
      try {
        if(this.currentUser.withdraw(amount)){
          return `Your balance: ${this.currentUser.balance}, withdraw amount: ${this.currentUser.withdrawAmount}`;
        } else {
          return this.otherInfo(1009);
        }
        
      } catch (e) {
        return `Error occured: ${e}`;
      }
    }
  
    transfer(targetName, amount) {

      let target = this.users[targetName.name];

      if (!target) {
        return "User not found";
      }

      try {

        this.currentUser.transfer(target, amount);

        if(this.currentUser.owedToValue === 0){

          if(this.currentUser.owedFromValue > 0){
            return `Your balance is $${this.currentUser.balance} \nOwed $${this.currentUser.owedFromValue} from ${this.currentUser.owedFromName}`;
          } else {
            return `Transferred $${this.currentUser.transferValue} to ${target.name} \nYour balance is $${this.currentUser.balance}`;
          }
           
        } else if(this.currentUser.owedToValue > 0){
          return `Transferred $${this.currentUser.transferValue} to ${target.name} \nYour balance is $${this.currentUser.balance} \nOwed $${this.currentUser.owedToValue} to ${target.name}`
        }

      } catch (e) {
        return `Error occured: ${e}`;
      }
    }

    check(){
      return `Hello, ${this.currentUser.name}! \nYour balance is ${this.currentUser.balance}\nYou owed $${this.currentUser.owedToValue} to ${this.currentUser.owedToName}`;
    }

    getLogoutInfo(){
      return `Goodbye, ${this.currentUser.name}!`
    }

    otherInfo(type){
      let message = "";
      switch (type) {
        case 1001:
          message = 'You are already logged in.';
          break;
        case 1002:
          message = 'Invalid syntax! please enter a valid name to login';
          break;
        case 1003:
          message = 'You need to be logged in to make a deposit.';
          break;
        case 1004:
          message = 'Please enter a valid amount.';
          break;
        case 1005:
          message = 'You need to be logged in to make a withdrawal.';
          break;
        case 1006:
          message = 'You need to be logged in to make a transfer.';
          break;
        case 1007:
          message = 'Please enter a valid name and amount.';
          break;
        case 1008:
            message = 'You need to be logged in to check your account.';
          break;
        case 1009:
            message = 'You cannot withdraw the specified amount due to insufficient funds.';
          break;
        default:
          message = 'Unknown command. Type "help" for a list of available commands.';
          break;
      }
      return message;
    }
    
  }

  module.exports = MessageHandlerClass