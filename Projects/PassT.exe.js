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
    body.innerHTML = ''; // Clear placeholders
    writeLine(">> Initializing PasswordTester.exe...", "cyan");
    setTimeout(bootSystem, 500); // Slight delay for the "pro" feel

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