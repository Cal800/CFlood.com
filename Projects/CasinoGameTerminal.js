window.addEventListener('DOMContentLoaded', () => {
    // 1. Grab elements from your HTML terminal structure
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');

    // 2. Game State Management (Mimicking Java Scanner & nested while loops)
    let state = "BOOTING"; // MENU, RULES, SELECT_CHIPS, SELECT_OUTCOME, PLACE_BET, DEALING, PLAY_AGAIN, GAME_OVER
    let currentChips = 0;
    let userDecision = "";
    let userBet = 0;

    // Helper for timed pauses (Mimics Java Thread.sleep)
    const pause = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

    // 3. Helper to print lines (Preserves exact whitespace/ASCII art)
    function writeLine(text, type = "default") {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.style.whiteSpace = 'pre-wrap'; // Ensures ASCII table alignment stays crisp

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
        body.scrollTop = body.scrollHeight;
    }

    // 4. ASCII Table Renderer (Matches your exact Java layout)
    function renderTable(p1 = "  ", p2 = "  ", b1 = "  ", b2 = "  ") {
        const table = 
`       ______________________________________
      /            * BACCARAT *              \\
     /         --- PAYS 2 TO 1 ---            \\
    /                                          \\
   |     PLAYER                BANKER           |
   |   [ ${p1} ][ ${p2} ]          [ ${b1} ][ ${b2} ]       |
   |                                            |
    \\            [ PLAYER ] [ TIE ]            /
     \\               [ BANKER ]               /
      \\______________________________________/`;
        writeLine(table, "cyan");
    }

    // 5. Card Generation & Scoring Logic (1:1 port of your Java methods)
    function chooseCard() {
        const cardNum = Math.floor(Math.random() * 13) + 1; // 1 to 13
        let face = "";
        let hasFace = false;

        if (cardNum === 1) { face = "A"; hasFace = true; }
        else if (cardNum === 10) { face = "T"; hasFace = true; }
        else if (cardNum === 11) { face = "J"; hasFace = true; }
        else if (cardNum === 12) { face = "Q"; hasFace = true; }
        else if (cardNum === 13) { face = "K"; hasFace = true; }

        const suits = ["♠", "♣", "♥", "♦"];
        const suit = suits[Math.floor(Math.random() * suits.length)];

        return hasFace ? `${face}${suit}` : `${cardNum}${suit}`;
    }

    function getCardValue(card) {
        const rank = card.substring(0, 1);
        switch (rank) {
            case "A": return 1;
            case "T":
            case "J":
            case "Q":
            case "K": return 0;
            default: return parseInt(rank, 10);
        }
    }

    function calculateWinner(p1, p2, b1, b2) {
        const pTotal = getCardValue(p1) + getCardValue(p2);
        const bTotal = getCardValue(b1) + getCardValue(b2);

        const playerScore = pTotal % 10;
        const bankerScore = bTotal % 10;

        if (playerScore > bankerScore) return "Player";
        if (playerScore < bankerScore) return "Banker";
        return "Tie";
    }

    // 6. Menu & Round Prompts
    function showMainMenu() {
        state = "MENU";
        writeLine("\n====================");
        writeLine("Welcome to Baccarat!!", "cyan");
        writeLine("====================");
        writeLine("\n1) Play!");
        writeLine("2) Rules");
        writeLine("\nType 1 or 2 and press Enter >>");
    }

    function showRules() {
        state = "RULES";
        writeLine("\nRules", "cyan");
        writeLine("========");
        writeLine("1) Pick Your Side and Hit Deal:\nChoose your chip value, click Player, Banker, or Tie, and hit Deal.\nYou’re simply predicting which hand gets closer to 9.\n");
        writeLine("2) Know the Card Values:\nAces = 1, cards 2–9 = face value, and 10s/Face cards = 0.\n");
        writeLine("3) Drop the First Digit:\nScores never go past 9. If a hand totals 10 or more, drop the tens digit\n(e.g., 8 + 7 = 15, so the score is 5).\n");
        writeLine("4) Watch for a \"Natural\" 8 or 9:\nTwo cards are dealt to each side.\nIf either hand hits 8 or 9 right away, You know whose going to win!\n");
        writeLine("5) Closest to 9 Wins:\nIf there's no Natural, the game automatically finishes the hand using built-in rules,\ncompares the final totals, and credits your winnings instantly.");
        writeLine("\nPress 'Q' to return to menu >>");
    }

    function promptChipSelection() {
        state = "SELECT_CHIPS";
        writeLine("\n============================");
        writeLine("Welcome to the casino table!", "cyan");
        writeLine("\nPick a starting amount of chips to play with!");
        writeLine("1) 5,000 chips");
        writeLine("2) 15,000 chips");
        writeLine("3) 30,000 chips");
        writeLine("\nEnter choice (1, 2, 3 or chip value) >>");
    }

    function startNewRound() {
        state = "SELECT_OUTCOME";
        writeLine("\nLets Begin!\n");
        renderTable();
        writeLine("\nWhat outcome do you want to choose?");
        writeLine("1) Player");
        writeLine("2) Banker");
        writeLine("3) Tie");
        writeLine("\nEnter choice (1, 2, 3 or name) >>");
    }

    function promptBet() {
        state = "PLACE_BET";
        writeLine("\nNow its time to bet!");
        writeLine(`You currently have: <span class="cyan-text">${currentChips}</span> chips`);

        if (currentChips > 1000) {
            const maxBet = currentChips - 1000;
            writeLine(`The Maximum Bet is: <span class="cyan-text">${maxBet}</span>`);
        } else {
            writeLine("You can go all in if needed!", "cyan");
        }
        writeLine("Enter bet amount (multiples of 500) >>");
    }

    // 7. Async Round Execution (Handles dealing & timed pauses cleanly)
    async function executeRound() {
        state = "DEALING";
        input.disabled = true; // Lock input while dealer runs the hand

        await pause(1.5);
        writeLine("\nBetting Closed!", "cyan");
        writeLine("\n=====================");
        writeLine("Final Bet");
        writeLine(`Decision: <span class="cyan-text">${userDecision}</span>`);
        writeLine(`Betting Amount: <span class="cyan-text">${userBet}</span>`);
        writeLine("=======================");

        await pause(1.5);

        // Deal Player Cards
        const pCard1 = chooseCard();
        const pCard2 = chooseCard();
        renderTable(pCard1, pCard2, "  ", "  ");

        await pause(1.5);
        writeLine("\n       ==== Choosing Bankers Cards ====\n", "cyan");

        // Deal Banker Cards
        const bCard1 = chooseCard();
        const bCard2 = chooseCard();
        await pause(1.5);
        renderTable(pCard1, pCard2, bCard1, bCard2);

        await pause(1.5);
        writeLine("\nEvaluating The Winning Outcome....");
        const winner = calculateWinner(pCard1, pCard2, bCard1, bCard2);
        await pause(2);

        writeLine(`The Winning Outcome was <span class="cyan-text">${winner}</span>!`);
        await pause(1);

        let winnings = 0;

        if (winner === "Tie" && winner === userDecision) {
            writeLine("\nYou win big! A Tie is a 3 to 1 win! Congratulations!", "success");
            winnings = (userBet * 3) + userBet;
            writeLine(`Winnings >> ${winnings}`);
            writeLine(`Previous Balance: ${currentChips}`);
            currentChips += winnings;
            writeLine(`New Chip Balance: <span class="tag-green">${currentChips} ▲</span>`);
        } else if (userDecision === winner) {
            writeLine(`\nYou Win! A ${winner} is a 2 to 1 win! Congratulations!`, "success");
            winnings = (userBet * 2) + userBet;
            writeLine(`Winnings >> ${winnings}`);
            writeLine(`Previous Balance: ${currentChips}`);
            currentChips += winnings;
            writeLine(`New Chip Balance: <span class="tag-green">${currentChips} ▲</span>`);
        } else {
            writeLine("\nLOSS", "error");
            writeLine(`Winning Outcome: ${winner}`);
            writeLine(`Your Choice: ${userDecision}`);
            const oldBalance = currentChips + userBet;
            writeLine(`Previous Balance: ${oldBalance}`);
            writeLine(`New Chip Balance: <span class="tag-rose">${currentChips} ▼</span>`);
        }

        input.disabled = false;
        input.focus();

        if (currentChips <= 0) {
            writeLine("\nYou went BUST!", "error");
            writeLine("Thanks for playing!");
            writeLine("\n       ==== Cal Flood 2026 ====", "cyan");
            writeLine("\nType 'restart' to play again.");
            state = "GAME_OVER";
        } else {
            state = "PLAY_AGAIN";
            writeLine("\nPlay Again?");
            writeLine("Press 'A' to play again & 'Q' to quit >>");
        }
    }

    // Boot Sequence
    body.innerHTML = '';
    writeLine(">> Initializing BACCARAT.exe...", "cyan");
    setTimeout(() => {
        writeLine(">> System Ready.");
        showMainMenu();
    }, 800);

    // 8. Main Terminal Input Listener
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && state !== "DEALING" && state !== "BOOTING") {
            const rawVal = input.value.trim();
            const val = rawVal.toLowerCase();

            writeLine(`<span class="prompt">CFlood.com:~$</span> ${rawVal}`);
            input.value = '';

            // Global utility commands
            if (val === "clear") {
                body.innerHTML = '';
                showMainMenu();
                return;
            }
            if (val === "restart") {
                body.innerHTML = '';
                showMainMenu();
                return;
            }

            // State Machine Routing
            if (state === "MENU") {
                if (val === "play!" || val === "play" || val === "1") {
                    promptChipSelection();
                } else if (val === "rules" || val === "2") {
                    showRules();
                } else {
                    writeLine("Please input a valid choice (1 or 2).", "error");
                }
            }

            else if (state === "RULES") {
                if (val === "q") {
                    showMainMenu();
                } else {
                    writeLine("Please type 'Q' to return to the menu.", "error");
                }
            }

            else if (state === "SELECT_CHIPS") {
                if (val === "5000" || val === "1") {
                    currentChips = 5000;
                    startNewRound();
                } else if (val === "15000" || val === "2") {
                    currentChips = 15000;
                    startNewRound();
                } else if (val === "30000" || val === "3") {
                    currentChips = 30000;
                    startNewRound();
                } else {
                    writeLine("Please choose a valid option: 1, 2, 3 or chip values like 5000 (without commas).", "error");
                }
            }

            else if (state === "SELECT_OUTCOME") {
                if (val === "player" || val === "1") {
                    userDecision = "Player";
                    promptBet();
                } else if (val === "banker" || val === "2") {
                    userDecision = "Banker";
                    promptBet();
                } else if (val === "tie" || val === "3") {
                    userDecision = "Tie";
                    promptBet();
                } else {
                    writeLine("Please enter a valid choice: Player (1), Banker (2), or Tie (3).", "error");
                }
            }

            else if (state === "PLACE_BET") {
                const parsedBet = parseInt(rawVal, 10);
                const maxBet = currentChips > 1000 ? currentChips - 1000 : currentChips;

                if (isNaN(parsedBet) || parsedBet > maxBet || parsedBet <= 0 || parsedBet % 500 !== 0) {
                    writeLine(`Invalid bet! Must be > 0, a multiple of 500, and <= ${maxBet}.`, "error");
                } else {
                    userBet = parsedBet;
                    currentChips -= userBet;
                    executeRound();
                }
            }

            else if (state === "PLAY_AGAIN") {
                if (val === "a") {
                    startNewRound();
                } else if (val === "q") {
                    writeLine("\n       Thanks for playing!", "cyan");
                    writeLine("\n       ==== Cal Flood 2026 ====", "cyan");
                    writeLine("\nType 'restart' to return to the main menu.");
                    state = "GAME_OVER";
                } else {
                    writeLine("Please enter 'A' to play again or 'Q' to quit.", "error");
                }
            }

            else if (state === "GAME_OVER") {
                writeLine("Session ended. Type 'restart' to boot back into Baccarat.", "cyan");
            }
        }
    });
});