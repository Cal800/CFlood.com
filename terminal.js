window.addEventListener('DOMContentLoaded', () => {
    // 1. Grab the elements from your HTML
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');

    // 2. Global System State (Your Java Variables)
    let password = "Hi";
    let kypd = "3356";
    let currentMode = "MENU"; 

    // 3. Helper to print lines (Mimics System.out.println)
    function writeLine(text, type = "default") {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (type === "cyan") {
            line.innerHTML = `<span class="cyan-text">${text}</span>`;
        } else if (type === "error") {
            line.innerHTML = `<span class="tag-rose">ERROR:</span> ${text}`;
        } else if (type === "success") {
            line.innerHTML = `<span class="tag-green">${text}</span>`;
        } else {
            line.innerHTML = text;
        }
        
        body.appendChild(line);
        body.scrollTop = body.scrollHeight; // Keep view at the bottom
    }

    // 4. The Menu Sequence from your Java Project
    function bootSystem() {
        writeLine("\n--- MAIN MENU ---");
        writeLine("Current Password: " + password);
        writeLine("Current KeyPad Password: " + kypd);
        writeLine("\nSelect an option:");
        writeLine("1) Create a New Password");
        writeLine("2) Test the password strength");
        writeLine("3) Create a keypad password");
        writeLine("4) Brute Force the keypad password");
        writeLine("\nType 1, 2, 3, or 4 and press Enter >>");
    }

    // Start the system
    body.innerHTML = ''; // Clear the "System Ready" placeholder from HTML
    writeLine(">> Initializing PasswordTester.exe...", "cyan");
    bootSystem();

    // 5. Input Listener
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            
            // Show what the user typed
            writeLine(`<span class="prompt">CFlood.com:~$</span> ${val}`);
            input.value = '';

            if (currentMode === "MENU") {
                switch(val) {
                    case "1":
                        currentMode = "CREATE_PSWD";
                        writeLine("\n---- Create Password ----");
                        writeLine("Please enter your new password >> ");
                        break;
                    case "2":
                        testStrength();
                        break;
                    case "3":
                        currentMode = "CREATE_KYPD";
                        writeLine("\n---- Keypad Creator (1-9) ----");
                        writeLine("1 &nbsp; 2 &nbsp; 3<br>4 &nbsp; 5 &nbsp; 6<br>7 &nbsp; 8 &nbsp; 9");
                        writeLine("\nEnter a 4-digit keypad password >> ");
                        break;
                    case "4":
                        runBruteForce();
                        break;
                    case "clear":
                        body.innerHTML = '';
                        bootSystem();
                        break;
                    default:
                        writeLine("Invalid. Choose 1-4.", "error");
                }
            } 
            else if (currentMode === "CREATE_PSWD") {
                password = val;
                writeLine(`Password saved!`, "success");
                currentMode = "MENU";
                bootSystem();
            }
            else if (currentMode === "CREATE_KYPD") {
                if (/^[1-9]{4}$/.test(val)) {
                    kypd = val;
                    writeLine("Keypad Accepted.", "success");
                    currentMode = "MENU";
                    bootSystem();
                } else {
                    writeLine("Must be 4 digits (1-9). Try again >>", "error");
                }
            }
        }
    });

    // --- PORTED JAVA LOGIC ---

    function testStrength() {
        let score = 0;
        writeLine(`\nAnalyzing: ${password}`);

        if (password.length < 4) score -= 1;
        else if (password.length <= 8) score += 1;
        else score += 2;

        if (/.*[0-9].*/.test(password)) score += 1;
        if (/.*[A-Z].*/.test(password)) score += 1;
        if (/.*[$%&!*^<>£?@~#].*/.test(password)) score += 2;

        writeLine(`Final Score: ${score}`, "cyan");
        if (score <= 2) writeLine("Result: WEAK", "error");
        else if (score <= 5) writeLine("Result: MEDIUM", "cyan");
        else writeLine("Result: STRONG!", "success");
    }

    function runBruteForce() {
        writeLine(`\nBrute forcing: ${kypd}...`);
        const start = performance.now();
        let target = parseInt(kypd);
        let found = false;

        // Your shortcut logic
        if ([1234, 1111, 4321].includes(target)) found = true;

        if (!found) {
            for (let t = 1000; t <= 9000 && !found; t += 1000) {
                for (let x = 100; x <= 900 && !found; x += 100) {
                    for (let i = 10; i <= 90 && !found; i += 10) {
                        for (let y = 1; y <= 9 && !found; y++) {
                            if (t + x + i + y === target) found = true;
                        }
                    }
                }
            }
        }

        const end = performance.now();
        writeLine("PASSWORD FOUND!", "success");
        writeLine(`Crack Time: ${(end - start).toFixed(4)} ms`, "cyan");
    }
});

// FPBN Converter 

document.addEventListener('DOMContentLoaded', () => {
    const terminalContainer = document.querySelector('.terminal-container');
    const projectType = terminalContainer.getAttribute('data-project'); // "FPN_CALC" or "PASSWORD_TESTER"
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');

    let state = "BOOT";
    let tempFPN = "";
    let currentPassword = ""; // For Project 1 logic

    // --- 1. BOOT LOGIC ---
    if (projectType === "FPN_CALC") {
        runFPNBoot();
    } else {
        runPasswordBoot();
    }

    function runFPNBoot() {
        // Keeps your exact HTML visual starting point
        setTimeout(() => {
            printToTerminal("\n32 Bit Floating Point to Decimal Calculator");
            printToTerminal("Please enter your 32 bit number >> ");
            state = "AWAITING_BINARY";
        }, 1000);
    }

    function runPasswordBoot() {
        printToTerminal(">> Initializing PasswordSystem.exe...");
        setTimeout(() => {
            printToTerminal(">> System Ready.");
            showPasswordMenu();
        }, 1000);
    }

    // --- 2. THE MASTER INPUT LISTENER ---
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value;
            printToTerminal(`CFlood.com:~$ ${input}`);
            
            if (projectType === "FPN_CALC") {
                handleFPNLogic(input);
            } else {
                handlePasswordLogic(input);
            }
            
            terminalInput.value = "";
        }
    });

    // --- 3. PROJECT 2: FPN CALCULATOR LOGIC ---
    function handleFPNLogic(input) {
        if (input.toLowerCase() === 'help') {
            printToTerminal("Enter a 32-bit binary string to begin the conversion process.");
            return;
        }

        if (state === "AWAITING_BINARY") {
            if (input.length !== 32) {
                printToTerminal(`ERROR: FPN should be 32 bits. Yours is ${input.length}.`);
                return;
            }
            tempFPN = input;
            printToTerminal("\nAnswer or comprehensive walkthrough?");
            printToTerminal("A/C >> ");
            state = "AWAITING_MODE";
        } 
        else if (state === "AWAITING_MODE") {
            const result = performFPNMath(tempFPN, input.toUpperCase());
            printToTerminal(result);
            printToTerminal("\n-------------------------------------------");
            printToTerminal("Please enter your 32 bit number >> ");
            state = "AWAITING_BINARY";
        }
    }

    function performFPNMath(bin, mode) {
        const sign = bin.substring(0, 1);
        const exponent = bin.substring(1, 9);
        const mantissa = bin.substring(9);

        // Exponent Calculation
        const expDecimal = parseInt(exponent, 2);
        const finalExp = expDecimal - 127;

        // Mantissa Calculation (Java BinDivision logic)
        let mantissaTotal = 1.0; 
        let calcDetails = "";
        
        // We use the first 7 bits for the walkthrough as per your Java code
        for (let i = 0; i < 23; i++) {
            if (mantissa[i] === "1") {
                let bitValue = Math.pow(2, -(i + 1));
                mantissaTotal += bitValue;
                if (i < 7) calcDetails += `Calculation ${i+1} >>> ${bitValue}\n`;
            }
        }

        const finalAnswer = (sign === "0" ? 1 : -1) * mantissaTotal * Math.pow(2, finalExp);

        if (mode === "C") {
            return `
Sign Calculation:
Sign is the first bit - ${sign === "0" ? "positive" : "negative"}

Exponent Calculation:
Decimal Conversion >> ${expDecimal}
Bias adjustment: ${expDecimal} - 127 = ${finalExp}
Final Exponent calculation is >> 2^${finalExp}

Mantissa Calculation:
${calcDetails}
Final Mantissa (with leading 1) >> ${mantissaTotal.toFixed(6)}

FINAL ANSWER: ${finalAnswer}`;
        }
        return `\nFINAL ANSWER: ${finalAnswer}`;
    }

    // --- 4. PROJECT 1: PASSWORD LOGIC ---
    function handlePasswordLogic(input) {
        // Insert your Project 1 switch(input) logic here
        // (Option 1, 2, 3, 4 etc.)
    }

    function showPasswordMenu() {
        printToTerminal("\nMAIN MENU:");
        printToTerminal("1) Set Password");
        printToTerminal("2) Analyze Strength");
        printToTerminal("3) Set PIN");
        printToTerminal("4) Brute Force Simulation");
    }

    // --- UTILITIES ---
    function printToTerminal(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerText = text;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});