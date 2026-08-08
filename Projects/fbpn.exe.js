window.addEventListener('DOMContentLoaded', () => {
    // 1. Grab elements from your HTML
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');

    // 2. State Management (Mimicking Java Scanner flow)
    let currentMode = "MENU"; // MENU, AWAITING_BINARY, AWAITING_MODE
    let tempBinary = "";

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
        body.scrollTop = body.scrollHeight; // Keep scroll anchored at bottom
    }

    // 4. The Menu Sequence matching your Java setup
    function showMenu() {
        writeLine("\n--- MAIN MENU ---");
        writeLine("Select an option:");
        writeLine("1) Convert 32-Bit Floating Point Binary to Decimal");
        writeLine("Type 1 and press Enter >>");
        currentMode = "MENU";
    }

    // Start the system with the boot intro screen
    body.innerHTML = ''; 
    writeLine(">> Initializing FPBN.exe...", "cyan");
    
    // Smooth transition to show system is ready
    setTimeout(() => {
        writeLine(">> System Ready.");
        showMenu();
    }, 800);

    // 5. Main Terminal Input Listener
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            
            // Render user command back onto the terminal screen
            writeLine(`<span class="prompt">CFlood.com:~$</span> ${val}`);
            input.value = '';

            // Mode 1: Main Menu Option Selection
            if (currentMode === "MENU") {
                if (val === "1") {
                    currentMode = "AWAITING_BINARY";
                    writeLine("\n32 Bit Floating Point to Decimal Calculator");
                    writeLine("Please enter your 32-bit number >> ");
                } else if (val.toLowerCase() === "clear") {
                    body.innerHTML = '';
                    showMenu();
                } else {
                    writeLine("Invalid selection. Type 1 to begin.", "error");
                }
            } 
            
            // Mode 2: Capture and validate the 32-bit String
            else if (currentMode === "AWAITING_BINARY") {
                // Strip spaces if user pasted it with groupings
                const sanitizedBinary = val.replace(/\s+/g, '');

                if (sanitizedBinary.length !== 32 || !/^[01]+$/.test(sanitizedBinary)) {
                    writeLine(`ERROR: FPN must be exactly 32 bits of 0s and 1s. Yours: ${sanitizedBinary.length}`, "error");
                    writeLine("Please enter your 32-bit number >> ");
                    return;
                }
                
                tempBinary = sanitizedBinary;
                currentMode = "AWAITING_MODE";
                writeLine("\nChoose conversion pathway:");
                writeLine("A) Fast Way (Answer Only)");
                writeLine("C) Educational Way (Comprehensive Walkthrough)");
                writeLine("Select A or C >> ");
            }
            
            // Mode 3: Run the calculation path based on user choice
            else if (currentMode === "AWAITING_MODE") {
                const choice = val.toUpperCase();
                
                if (choice === 'A' || choice === 'C') {
                    const resultText = performFPNMath(tempBinary, choice);
                    writeLine(resultText);
                    writeLine("\n-------------------------------------------");
                    
                    // Loop directly back to option entry loop like a Java while loop
                    showMenu();
                } else {
                    writeLine("Invalid path choice. Type 'A' for Fast or 'C' for Educational >> ", "error");
                }
            }
        }
    });

    // --- Core 32-Bit IEEE-754 Ported Math Logic ---
    function performFPNMath(bin, mode) {
        const signBit = bin.substring(0, 1);
        const expBits = bin.substring(1, 9);
        const mantissaBits = bin.substring(9);

        // Calculate Exponent via base 2 parse
        const expDecimal = parseInt(expBits, 2);
        const finalExponent = expDecimal - 127;

        // Process Mantissa via Binary Division Fractional Summing
        let mantissaSum = 1.0; 
        let calculationSteps = "";
        
        for (let i = 0; i < 23; i++) {
            if (mantissaBits[i] === "1") {
                let positionalValue = Math.pow(2, -(i + 1));
                mantissaSum += positionalValue;
                
                // Track details for the first 7 bits for cleaner educational readout
                if (i < 7) {
                    calculationSteps += `   Calculation bit ${i + 1} >>> 2^-${i + 1} = ${positionalValue.toFixed(6)}\n`;
                }
            }
        }

        // Apply final formula matching your Java architecture
        const signMultiplier = (signBit === "0") ? 1 : -1;
        const finalAnswer = signMultiplier * mantissaSum * Math.pow(2, finalExponent);

        // Render based on Selected Pathway
        if (mode === "C") {
            return `
<span class="cyan-text">--- COMPREHENSIVE EDUCATIONAL BREAKDOWN ---</span>
<span class="cyan-text">Sign Bit Calculation:</span>
   Bit value: [${signBit}] -> Number is <span class="cyan-text">${signBit === "0" ? "Positive" : "Negative"}</span>

<span class="cyan-text">Exponent Calculation:</span>
   Binary segments: ${expBits}
   Decimal Conversion >> ${expDecimal}
   Bias Adjustment Formula: ${expDecimal} - 127 = ${finalExponent}
   Multiplier Term >> 2^${finalExponent}

<span class="cyan-text">Mantissa Calculation (Implicit 1 + Base-2 Fractional Div):</span>
${calculationSteps}   ... (remaining fractional tracking parsed)
   Final computed Mantissa value >> ${mantissaSum.toFixed(6)}

<span class="cyan-text">Final Equation Formed:</span>
   (${signMultiplier === 1 ? "" : "-"}${mantissaSum.toFixed(6)}) x 2^${finalExponent}

<span class="tag-green">FINAL DECIPHERED ANSWER: ${finalAnswer}</span>`;
        }

        // Fast Way Pathway (Answer Only)
        return `\n<span class="tag-green">FINAL ANSWER: ${finalAnswer}</span>`;
    }
});