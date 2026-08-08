/* ==========================================================================
   MODULE: qr_matrix_compiler.py (Python Venv Flask Micro-Sandbox Engine)
   ========================================================================== */

function generatePortfolioQrCode() {
    const targetInput = document.getElementById('qrTargetUrl');
    const consoleCanvas = document.getElementById('qrConsoleCanvas');
    const statusBadge = document.getElementById('qrEngineStatus');
    
    // Guard clause to prevent errors if the elements aren't present on the active DOM page
    if (!targetInput || !consoleCanvas || !statusBadge) return;
    
    const targetValue = targetInput.value.trim();
    
    // QR Engine Input Field Validation Error Handler
    if (!targetValue) {
        statusBadge.textContent = "STATUS: 400 BAD REQUEST";
        statusBadge.style.color = "#ff6b6b";
        statusBadge.style.borderColor = "#ff6b6b";
        
        consoleCanvas.innerHTML = `
            <span style="color: #ff6b6b;">[ERROR] ValidationError: Target parameter cannot be null or blank.</span><br>
            <span style="color: rgba(255,107,107,0.5);">>> File "main.py", line 14, in generate_qr</span><br>
            <span style="color: rgba(255,107,107,0.5);">>> request.form.get('link') -> returned None Type</span>
        `;
        return;
    }
    
    // Set 200 OK Success Compilation State
    statusBadge.textContent = "STATUS: 200 OK";
    statusBadge.style.color = "#17D8DB";
    statusBadge.style.borderColor = "#17D8DB";
    
    // Output live Python terminal operations mimicking the tutorial architecture
    // Output live Python terminal operations mimicking tutorial architecture
    consoleCanvas.innerHTML = `
        <span style="color: #66d9ef;">[INFO]</span> Incoming POST payload intercepted via <span class="cyan-text">/</span> route...<br>
        <span style="color: #a6e22e;">[DATA]</span> Target string payload: "${targetValue}"<br>
        <span style="color: #66d9ef;">[INFO]</span> Allocating virtual memory array via <span style="color: #e6db74;">BytesIO()</span>...<br>
        <span style="color: #66d9ef;">[INFO]</span> Executing compilation: <span style="color: #e6db74;">qrcode.make(data)</span><br>
        <span style="color: #66d9ef;">[INFO]</span> Streaming data cursor via <span style="color: #e6db74;">memory.seek(0)</span>...<br>
        <span style="color: #66d9ef;">[INFO]</span> Decoding binary stream into Base64 ASCII...<br>
        <span style="color: #a6e22e;">[SUCCESS]</span> Matrix rendering complete:<br>
        <div style="color: rgba(23, 216, 219, 0.3); margin: 6px 0;">------------------------------------------------------</div>
        <div style="display: flex; justify-content: center; align-items: center; flex: 1; padding: 10px 0;">
            <div id="qrcodeRenderOutput" style="background: #ffffff; padding: 12px; display: inline-block; border-radius: 6px; box-shadow: 0 0 20px rgba(23, 216, 219, 0.15);"></div>
        </div>
    `;
    
    // Mount the qrcodeJS dependency engine to render the structural vector array matrix
    setTimeout(() => {
        new QRCode(document.getElementById("qrcodeRenderOutput"), {
            text: targetValue,
            width: 140,
            height: 140,
            colorDark : "#0a0a0f",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        
        // Target specifically the isolated qrTerminalBody box to scroll downwards seamlessly
        const bodyWrapper = document.getElementById('qrTerminalBody');
        if (bodyWrapper) {
            bodyWrapper.scrollTop = bodyWrapper.scrollHeight;
        }
    }, 50);
}