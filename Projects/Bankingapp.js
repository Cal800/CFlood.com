window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');

    // --- Banking State Management ---
    let state = "LOGIN_NAME"; 
    let currentUser = { name: "", balance: 126, attempts: 0 };
    let sessionHistory = { deposit: 0, withdraw: 0 };
    
    // Mock Database
    const accounts = {
        "Damon": { card: "235-998-767", balance: 126 },
        "Fionn": { card: "334-765-498", balance: 7468 }
    };

    function writeLine(text, type = "default") {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (type === "cyan") line.innerHTML = `<span class="cyan-text">${text}</span>`;
        else if (type === "error") line.innerHTML = `<span class="tag-rose">ERROR:</span> ${text}`;
        else if (type === "success") line.innerHTML = `<span class="tag-green">${text}</span>`;
        else line.innerHTML = text;
        
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
    }

    function formatCurrency(amt) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
    }

    function showStartScreen() {
        state = "LOGIN_NAME";
        writeLine("\n>> welcome to the banking app", "cyan");
        writeLine("please enter your name >> ");
    }

    function showMenu() {
        state = "MAIN_MENU";
        writeLine(`\n--- ACCOUNT: ${currentUser.name.toUpperCase()} ---`);
        writeLine(`Bank Balance: ${formatCurrency(currentUser.balance)}`, "success");
        writeLine("\nSelect a service:");
        writeLine("1) Current Account");
        writeLine("2) Credit Card");
        writeLine("3) Savings Account");
        writeLine("4) Loans");
        writeLine("5) Mortgage Calculator");
        writeLine("6) Stock Investment");
        writeLine("Type 'logout' to exit.");
    }

    // --- Initial Boot ---
    body.innerHTML = '';
    showStartScreen();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            const cmd = val.toLowerCase();
            writeLine(`<span class="prompt">CFlood.com:~$</span> ${val}`);
            input.value = '';

            // Global Logout Command
            if (cmd === "logout") {
                writeLine("Logging out....", "error");
                currentUser.attempts = 0;
                sessionHistory = { deposit: 0, withdraw: 0 };
                setTimeout(showStartScreen, 800);
                return;
            }

            switch (state) {
                case "LOGIN_NAME":
                    const foundUser = Object.keys(accounts).find(u => u.toLowerCase() === cmd);
                    if (foundUser) {
                        currentUser.name = foundUser;
                        currentUser.balance = accounts[foundUser].balance;
                        state = "LOGIN_CARD";
                        writeLine(`\nHello ${foundUser}, please enter your card details (XXX-XXX-XXX)`);
                        writeLine("If you wish to return at any time, type 'logout'.");
                    } else {
                        writeLine("User not found. Try 'Damon' or 'Fionn'.", "error");
                    }
                    break;

                case "LOGIN_CARD":
                    if (val === accounts[currentUser.name].card) {
                        writeLine(`Access Granted. Welcome back, ${currentUser.name}.`, "success");
                        showMenu();
                    } else {
                        currentUser.attempts++;
                        if (currentUser.attempts >= 3) {
                            writeLine("Too many wrong attempts. System Locked.", "error");
                            setTimeout(showStartScreen, 2000);
                        } else {
                            writeLine(`Incorrect. Attempts left: ${3 - currentUser.attempts}`, "error");
                        }
                    }
                    break;

                case "MAIN_MENU":
                    if (val === "1" || cmd === "current account") {
                        state = "TRANSACTION_MODE";
                        writeLine("\n--- CURRENT ACCOUNT ---");
                        writeLine("Would you like to DEPOSIT or WITHDRAW?");
                        writeLine("Type 'finish' to view summary >>");
                    } else if (["2","3","4","5","6"].includes(val)) {
                        writeLine(`Service [${val}] is currently under maintenance.`, "cyan");
                    } else {
                        writeLine("Invalid selection. Choose 1-6 or logout.", "error");
                    }
                    break;

                case "TRANSACTION_MODE":
                    if (cmd === "deposit") {
                        state = "DO_DEPOSIT";
                        writeLine("Enter amount to deposit >>");
                    } else if (cmd === "withdraw") {
                        state = "DO_WITHDRAW";
                        writeLine("Enter amount to withdraw >>");
                    } else if (cmd === "finish") {
                        writeLine("\n--- SESSION SUMMARY ---");
                        writeLine(`Final Balance: ${formatCurrency(currentUser.balance)}`);
                        writeLine(`Total Deposited: ${formatCurrency(sessionHistory.deposit)}`);
                        writeLine(`Total Withdrawn: ${formatCurrency(sessionHistory.withdraw)}`);
                        writeLine("\nReturning to main menu...");
                        setTimeout(showMenu, 1500);
                    }
                    break;

                case "DO_DEPOSIT":
                    const depAmt = parseInt(val);
                    if (!isNaN(depAmt) && depAmt > 0) {
                        currentUser.balance += depAmt;
                        sessionHistory.deposit += depAmt;
                        writeLine(`Success. New Balance: ${formatCurrency(currentUser.balance)}`, "success");
                        state = "TRANSACTION_MODE";
                        writeLine("\nDEPOSIT or WITHDRAW? (or 'finish') >>");
                    } else {
                        writeLine("Invalid amount.", "error");
                    }
                    break;

                case "DO_WITHDRAW":
                    const withAmt = parseInt(val);
                    if (!isNaN(withAmt) && withAmt <= currentUser.balance) {
                        currentUser.balance -= withAmt;
                        sessionHistory.withdraw += withAmt;
                        writeLine(`Success. New Balance: ${formatCurrency(currentUser.balance)}`, "success");
                        state = "TRANSACTION_MODE";
                        writeLine("\nDEPOSIT or WITHDRAW? (or 'finish') >>");
                    } else {
                        writeLine("Insufficient funds or invalid amount.", "error");
                    }
                    break;
            }
        }
    });
});