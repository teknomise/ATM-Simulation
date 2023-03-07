# Build a JavaScript Command Line Interface (CLI) with Node.js

a Command Line Interface (CLI) to simulate an interaction of an ATM with a retail bank.

## Requirements

* [Node.js](http://nodejs.org/)

## Installation Steps (if applicable)

1. Clone repo
2. Run `npm install`
3. Run `npm start`
4. Input your prompt

## Commands

* `login [name]` - Logs in as this customer and creates the customer if not exist

* `deposit [amount]` - Deposits this amount to the logged in customer

* `withdraw [amount]` - Withdraws this amount from the logged in customer

* `transfer [target] [amount]` - Transfers this amount from the logged in customer to the target customer

* `logout` - Logs out of the current customer

## Prompt Tasks Session Scenarios

Enter command:      login Alice
Expected output:    Hello, Alice!
                    Your balance is $0

Enter command:      deposit 100
Expected output:    Your balance is $100

Enter command:      logout
Expected output:    Goodbye, Alice!

Enter command::     login Bob
Expected output:    Hello, Bob!
                    Your balance is $0

Enter command:      deposit 80
Expected output:    Your balance is $80

Enter command:      transfer Alice 50
Expected output:    Transferred $50 to Alice
                    your balance is $30

Enter command:      transfer Alice 100
Expected output:    Transferred $30 to Alice
                    Your balance is $0
                    Owed $70 to Alice

Enter command:      deposit 30
Expected output:    Transferred $30 to Alice
                    Your balance is $0
                    Owed $40 to Alice

Enter command:      logout
Expected output:    Goodbye, Bob!

Enter command:      login Alice
Expected output:    Hello, Alice!
                    Your balance is $210
                    Owed $40 from Bob

Enter command:      transfer Bob 30
Expected output:    Your balance is $210
                    Owed $10 from Bob

Enter command:      logout
Expected output:    Goodbye, Alice!

Enter command:      login Bob
Expected output:    Hello, Bob!
                    Your balance is $0
                    Owed $10 to Alice

Enter command:      deposit 100
Expected output:    Transferred $10 to Alice
                    Your balance is $90

Enter command:      logout
Expected output:    Goodbye, Bob!

--------- Additional -----------

Enter command:      login Alice
Expected output:    Hello, Alice! 
                    Your balance is 210

Enter command:      withdraw
Expected output:    Your balance: 30, withdraw amount: 180

Enter command:      logout
Expected output:    Goodbye, Alice!     


## Unit Testing
Testing function use Mocha & Sinon Library, to use it run `npm test`

## Design Pattern
The code utilizes several design patterns to achieve its functionality. Firstly, the Command pattern is employed as each user input is mapped to a specific command, which is executed by the program. The handleInput() function processes the user input to determine which command to execute and then calls the corresponding method of the MessageHandlerClass or CoreClass objects to carry out the desired action.

Secondly, the code utilizes the Singleton pattern, which ensures that only a single instance of the MessageHandlerClass and CoreClass objects are created and referenced throughout the program.

Finally, the code also demonstrates the use of the Observer pattern, as it uses event-driven programming to listen for and respond to user input via the readline module. The handleInput() function functions as an event handler, responding to input events triggered by the line event emitted by the readline module, and executing the appropriate command in response.