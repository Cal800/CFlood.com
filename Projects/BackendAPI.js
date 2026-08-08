// Database state baseline setup
if (!localStorage.getItem('mockBookJournal')) {
    const initialBooks = [
        { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", addedAt: "2026-05-20" },
        { id: 2, title: "Neuromancer", author: "William Gibson", addedAt: "2026-05-24" }
    ];
    localStorage.setItem('mockBookJournal', JSON.stringify(initialBooks));
}

let activeMethod = 'POST';

// MAIN DROP-DOWN METHOD ROUTER SWAPPER
function setApiMethod(method) {
    activeMethod = method;
    
    // 1. Manage Active Class UI states for Selector Row
    document.querySelectorAll('.method-pill').forEach(pill => pill.classList.remove('active'));
    if(method === 'POST') document.querySelector('.pill-post').classList.add('active');
    if(method === 'PUT') document.querySelector('.pill-put').classList.add('active');
    if(method === 'DELETE') document.querySelector('.pill-delete').classList.add('active');
    
    // 2. Adjust dynamic text variables inside the terminal headings
    document.getElementById('formHeading').textContent = `>> REQUEST HEADER (${method})`;
    
    // 3. Toggle fields visibility depending on REST specifications
    const idGroup = document.getElementById('idInputGroup');
    const titleGroup = document.getElementById('titleInputGroup');
    const authorGroup = document.getElementById('authorInputGroup');
    const targetIdVal = document.getElementById('simBookId').value || ':id';
    
    if (method === 'POST') {
        idGroup.style.display = 'none';
        titleGroup.style.display = 'block';
        authorGroup.style.display = 'block';
        updateRouteLine('#238636', 'POST', 'books');
    } else if (method === 'PUT') {
        idGroup.style.display = 'block';
        titleGroup.style.display = 'block';
        authorGroup.style.display = 'block';
        updateRouteLine('#d97706', 'PUT', `books/${targetIdVal}`);
    } else if (method === 'DELETE') {
        idGroup.style.display = 'block';
        titleGroup.style.display = 'none'; // Payload fields completely unnecessary for standard DELETE routing operations
        authorGroup.style.display = 'none';
        updateRouteLine('#b91c1c', 'DELETE', `books/${targetIdVal}`);
    }
}

function updateRouteLine(bgColor, label, endpoint) {
    document.getElementById('apiMethodLine').innerHTML = `>> Active Route: <span style="background: ${bgColor}; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 0.75rem; font-weight: bold;">${label}</span> <span class="cyan-text">http://localhost:3000/api/${endpoint}</span>`;
}

function syncTargetIdRoute(val) {
    const displayId = val.trim() !== "" ? val : ":id";
    if(activeMethod === 'PUT') updateRouteLine('#d97706', 'PUT', `books/${displayId}`);
    if(activeMethod === 'DELETE') updateRouteLine('#b91c1c', 'DELETE', `books/${displayId}`);
}

// Router switcher wrapper
function handleFormExecution() {
    if (activeMethod === 'POST') executeMockPostRequest();
    if (activeMethod === 'PUT') executeMockPutRequest();
    if (activeMethod === 'DELETE') {
        const targetId = parseInt(document.getElementById('simBookId').value);
        if(!targetId) {
            renderConsoleError("Execution Halted", ["Target Record ID is required to match path logic."]);
            return;
        }
        executeMockDeleteRequest(targetId);
    }
}

// CREATE METHOD (POST)
function executeMockPostRequest() {
    const titleInput = document.getElementById('simTitle');
    const authorInput = document.getElementById('simAuthor');
    const responseBox = document.getElementById('simResponse');
    const statusBox = document.getElementById('simStatus');
    
    if (!titleInput.value.trim() || !authorInput.value.trim()) {
        renderConsoleError("Validation Failed", ["title", "author"]);
        return;
    }
    
    let books = JSON.parse(localStorage.getItem('mockBookJournal'));
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    
    const newBook = {
        id: newId,
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        addedAt: new Date().toISOString().split('T')[0]
    };
    
    books.push(newBook);
    localStorage.setItem('mockBookJournal', JSON.stringify(books));
    
    statusBox.textContent = "STATUS: 201 CREATED";
    statusBox.style.color = "#17D8DB";
    responseBox.style.color = "#a6e22e";
    responseBox.textContent = JSON.stringify({ success: true, inserted: newBook }, null, 4);
    
    resetFormInputs();
    updateMockDbUI();
}

// EXECUTE UPDATE (PUT)
function executeMockPutRequest() {
    const targetId = parseInt(document.getElementById('simBookId').value);
    const titleInput = document.getElementById('simTitle');
    const authorInput = document.getElementById('simAuthor');
    const responseBox = document.getElementById('simResponse');
    const statusBox = document.getElementById('simStatus');
    
    if (!targetId || !titleInput.value.trim() || !authorInput.value.trim()) {
        renderConsoleError("Mutation Failed", ["id", "title", "author"]);
        return;
    }
    
    let books = JSON.parse(localStorage.getItem('mockBookJournal'));
    const index = books.findIndex(b => b.id === targetId);
    
    if (index !== -1) {
        books[index].title = titleInput.value.trim();
        books[index].author = authorInput.value.trim();
        localStorage.setItem('mockBookJournal', JSON.stringify(books));
        
        statusBox.textContent = "STATUS: 200 OK";
        statusBox.style.color = "#17D8DB";
        responseBox.style.color = "#a6e22e";
        responseBox.textContent = JSON.stringify({ success: true, message: `Resource ID #${targetId} updated successfully.`, updatedRecord: books[index] }, null, 4);
        resetFormInputs();
        setApiMethod('POST'); // Shift back to clean setup
    } else {
        renderConsoleError("Resource Not Found", [`id: ${targetId}`], "404 NOT FOUND");
    }
    updateMockDbUI();
}

// REMOVE INSTANCE (DELETE)
function executeMockDeleteRequest(id) {
    let books = JSON.parse(localStorage.getItem('mockBookJournal'));
    const index = books.findIndex(b => b.id === id);
    const responseBox = document.getElementById('simResponse');
    const statusBox = document.getElementById('simStatus');
    
    if (index !== -1) {
        const deletedRecord = books.splice(index, 1)[0];
        localStorage.setItem('mockBookJournal', JSON.stringify(books));
        
        statusBox.textContent = "STATUS: 200 OK";
        statusBox.style.color = "#17D8DB";
        responseBox.style.color = "#e2a62e"; 
        responseBox.textContent = JSON.stringify({ success: true, message: `Resource target path ID #${id} deleted.`, removed: deletedRecord }, null, 4);
        resetFormInputs();
        setApiMethod('POST');
    } else {
        renderConsoleError("Resource Not Found", [`id: ${id}`], "404 NOT FOUND");
    }
    updateMockDbUI();
}

// UI Hook for table row direct execution path shortcuts
function selectRowForEdit(id, title, author) {
    setApiMethod('PUT');
    document.getElementById('simBookId').value = id;
    document.getElementById('simTitle').value = title;
    document.getElementById('simAuthor').value = author;
    syncTargetIdRoute(id.toString());
    document.getElementById('simTitle').focus();
}

function updateMockDbUI() {
    const books = JSON.parse(localStorage.getItem('mockBookJournal'));
    const container = document.getElementById('simDbRows');
    
    if (books.length === 0) {
        container.innerHTML = `<em style="color: rgba(224,224,224,0.4); display: block; padding: 10px;">[Empty Table Instance]</em>`;
        return;
    }
    
    let html = `<table style="width:100%; text-align:left; border-collapse: collapse; font-family: inherit;">`;
    html += `<tr style="color: rgba(23, 216, 219, 0.6); border-bottom: 1px solid rgba(23,216,219,0.2);"><th style="padding: 6px 10px; font-size:0.7rem;">ID</th><th style="padding: 6px 10px; font-size:0.7rem;">TITLE</th><th style="padding: 6px 10px; font-size:0.7rem;">AUTHOR</th><th style="padding: 6px 10px; font-size:0.7rem; text-align:right;">ACTIONS</th></tr>`;
    
    books.forEach(book => {
        // Escaping simple values
        const escTitle = book.title.replace(/'/g, "\\'");
        const escAuthor = book.author.replace(/'/g, "\\'");
        
        html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 8px 10px; color:#17d8db;">#0${book.id}</td><td style="padding: 8px 10px; font-weight:500;">${book.title}</td><td style="padding: 8px 10px; color:rgba(255,255,255,0.7);">${book.author}</td><td style="text-align:right; padding-right:10px;"><button class="table-action-icon edit-btn" style="background:none; border:none; color:#17D8DB; cursor:pointer; margin-right:8px;" onclick="selectRowForEdit(${book.id}, '${escTitle}', '${escAuthor}')"><i class="fas fa-edit"></i></button><button class="table-action-icon delete-btn" style="background:none; border:none; color:rgba(248,81,73,0.6); cursor:pointer;" onclick="executeMockDeleteRequest(${book.id})"><i class="fas fa-trash-alt"></i></button></td></tr>`;
    });
    
    html += `</table>`;
    container.innerHTML = html;
}

function resetFormInputs() {
    document.getElementById('simBookId').value = "";
    document.getElementById('simTitle').value = "";
    document.getElementById('simAuthor').value = "";
}

function renderConsoleError(errType, properties, statusStr = "400 BAD REQUEST") {
    const responseBox = document.getElementById('simResponse');
    const statusBox = document.getElementById('simStatus');
    statusBox.textContent = `STATUS: ${statusStr}`;
    statusBox.style.color = "#ff6b6b";
    responseBox.style.color = "#ff6b6b";
    responseBox.textContent = JSON.stringify({ error: errType, message: properties, systemTime: new Date().toISOString() }, null, 4);
}

document.addEventListener("DOMContentLoaded", updateMockDbUI);