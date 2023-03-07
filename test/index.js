const assert = require('assert');
const sinon = require('sinon');
const CoreClass = require('../classes/CoreClass');
const MessageHandlerClass = require('../classes/MessageHandlerClass');
const handleInput = require('../handleInput');

// initialize message handler
const messageHandler = new MessageHandlerClass();

// stub console.log so we can check its output
const consoleLogStub = sinon.stub(console, 'log');

describe('handleInput', function() {
  beforeEach(function() {
    consoleLogStub.resetHistory();
  });

  describe('login function', function() {
    it('should log in the user with the given name', function() {
      handleInput('login Alice');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Alice'));
    });

    it('should not log in the user if they are already logged in', function() {
      handleInput('login Alice');
      handleInput('login Bob');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.otherInfo(1001));
    });

    it('should prompt the user to enter a name if no name is provided', function() {
      handleInput('login');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.otherInfo(1002));
    });
  });

  describe('deposit function', function() {
    it('should deposit the given amount if the user is logged in', function() {
      handleInput('login Alice');
      handleInput('deposit 100');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.deposit(100));
    });

    it('should logout to simulate not logged in', function() {
      handleInput('logout');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], 'Goodbye, Alice!');
    });

    it('should not deposit any amount if the user is not logged in', function() {
      handleInput('deposit 100');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.otherInfo(1003));
    });

    it('should prompt the user to enter an amount if no amount is provided', function() {
      handleInput('login Alice');
      handleInput('deposit');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.otherInfo(1004));
      handleInput('logout');
    });
  });

  describe('withdraw function', function() {

    it('should withdraw the given amount if the user is logged in and has enough balance', function() {
      const alice = new CoreClass('Alice');
      alice.balance = 200;
      handleInput('login Alice');
      handleInput('withdraw 100');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.withdraw(100));
      handleInput('logout');
    });

    it('should not withdraw any amount if the user is not logged in', function() {
      handleInput('withdraw 100');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.otherInfo(1005));
    });

    it('should prompt the user to enter an amount if no amount is provided', function() {
      handleInput('login Alice');
      handleInput('withdraw');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.otherInfo(1004));
      handleInput('logout');
    });

    it('should display an error message if the user does not have enough balance', function() {
      const alice = new CoreClass('Alice');
      alice.balance = 50;
      handleInput('login Alice');
      handleInput('withdraw 100');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], 'You cannot withdraw the specified amount due to insufficient funds.');
      handleInput('logout');
    });
  });

  describe('transfer function', function(){

    it('should not transfer any amount if the user is not logged in', function() {
      handleInput('transfer Alice 100');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.otherInfo(1006));
    });

    it('should prompt the user to enter an amount if no amount is provided', function() {
      handleInput('login Alice');
      handleInput('transfer');
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.otherInfo(1007));
      handleInput('logout');
    });

    it('should transfer the given amount to other user if user is logged in and has enough balance', function() {
      handleInput('login Bob');
      handleInput('deposit 100');
      const targetUser = new CoreClass('Alice');
      handleInput('transfer Alice 50');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Bob'));
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.deposit(100));
      assert.strictEqual(consoleLogStub.getCall(2).args[0], messageHandler.transfer(targetUser,50));
      handleInput('logout');
    });

    it('should transfer the given amount to other user if user is logged in and user owed to other user due to Insufficient Fund', function() {
      handleInput('login Bob');
      const targetUser = new CoreClass('Alice');
      handleInput('transfer Alice 50')
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Bob'));
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.transfer(targetUser,50));
      handleInput('logout');
    });

    it('should throw error user not found, if transfer syntax has not user name', function() {
      handleInput('login Bob');
      handleInput('transfer "" 50')
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Bob'));
      assert.strictEqual(consoleLogStub.getCall(1).args[0], 'User not found');
      handleInput('logout');
    });

  });

  describe('check function', function() {
    it('should show user balance information', function() {
      handleInput('login Bob');
      handleInput('check')
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Bob'));
      assert.strictEqual(consoleLogStub.getCall(1).args[0], messageHandler.check());
      handleInput('logout');
    });
  });

  describe('Test scenario and commands', function() {
    it('ALice login to the system', function() {
      handleInput('login Alice');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Alice'));
    });
    it('ALice make deposit $100', function() {
      handleInput('deposit 100');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.deposit(100));
    });
    it('ALice logout from the system', function() {
      handleInput('logout');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], 'Goodbye, Alice!');
    });
    it('Bob login to the system', function() {
      handleInput('login Bob');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Bob'));
    });
    it('Bob deposited $80', function() {
      handleInput('deposit 80');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.deposit(80));
    });
    it('Bob transfered $50 to Alice, and now has $30 in his account.', function() {
      handleInput('transfer Alice 50');
      const targetUser = new CoreClass('Alice');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.transfer(targetUser,50));
    });
    it('Bob sent $100 to Alice and now owes her $70. His account balance is $0.', function() {
      handleInput('transfer Alice 100');
      const targetUser = new CoreClass('Alice');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.transfer(targetUser,100));
    });
    it("Bob deposited $30 to Alice's account and now owes her $40.", function() {
      handleInput('deposit 30');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.deposit(30));
    });
    it('Bob logout from the system', function() {
      handleInput('logout');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], 'Goodbye, Bob!');
    });
    it('ALice login again to the system', function() {
      handleInput('login Alice');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Alice'));
    });
    it("Alice transferred $30 to Bob, which reduced Bob's debt to $10.", function() {
      handleInput('transfer Bob 30');
      const targetUser = new CoreClass('Bob');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.transfer(targetUser,30));
    });
    it('ALice logout from the system', function() {
      handleInput('logout');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], 'Goodbye, Alice!');
    });
    it('Bob login to the system', function() {
      handleInput('login Bob');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.login('Bob'));
    });
    it("Bob deposited $100, now he has no debt to Alice, and his account balance is $90.", function() {
      handleInput('deposit 100');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], messageHandler.deposit(100));
    });
    it('Bob logout from the system, testing scenario finished', function() {
      handleInput('logout');
      assert.strictEqual(consoleLogStub.getCall(0).args[0], 'Goodbye, Bob!');
    });
  });



});
