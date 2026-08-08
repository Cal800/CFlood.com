/* ==========================================================================
   MODULE: MusicEz Core Mock Database Engine (LocalStorage Persistence Layer)
   ========================================================================== */

// Initialize baseline schema data elements matching requirements if storage is empty
if (!localStorage.getItem('musicEz_db')) {
    const baselineDatabase = {
        artists: [
            { id: 1, name: "Eminem", genre: "Hip-Hop", monthly_listeners: "62000000" },
            { id: 2, name: "Oasis", genre: "Britpop", monthly_listeners: "21000000" }
        ],
        albums: [
            { id: 1, name: "The Marshall Mathers LP", release_year: "2000", artist_id: "1" },
            { id: 2, name: "(What's the Story) Morning Glory?", release_year: "1995", artist_id: "2" }
        ],
        songs: [
            { id: 1, name: "Stan", release_year: "2000", album_id: "1" },
            { id: 2, name: "Don't Look Back in Anger", release_year: "1995", album_id: "2" }
        ]
    };
    localStorage.setItem('musicEz_db', JSON.stringify(baselineDatabase));
}

// Global Memory State Mutation Trackers
let currentEditingArtistId = null;
let currentEditingAlbumId = null;
let currentEditingSongId = null;

// Core Read/Write Data Operations
function getMusicData() {
    return JSON.parse(localStorage.getItem('musicEz_db'));
}

function saveMusicData(data) {
    localStorage.setItem('musicEz_db', JSON.stringify(data));
}

/* --- SUB-CONTROLLER: ARTISTS REPOSITORY --- */
function renderArtists() {
    const db = getMusicData();
    const tbody = document.querySelector('#artistTable tbody');
    if (!tbody) return;

    tbody.innerHTML = db.artists.map(a => {
        const escName = a.name.replace(/'/g, "\\'");
        const escGenre = a.genre.replace(/'/g, "\\'");
        return `
            <tr>
                <td style="color: var(--primary-orange); font-weight: bold;">#0${a.id}</td>
                <td style="font-weight: 500; color: #fff;">${a.name}</td>
                <td style="color: rgba(255,255,255,0.75);">${a.genre}</td>
                <td><i class="fas fa-headphones" style="color: rgba(255,255,255,0.3); margin-right: 6px;"></i> ${parseInt(a.monthly_listeners).toLocaleString()}</td>
                <td>
                    <div class="action-btns">
                        <span class="edit-link" onclick="setupArtistEdit(${a.id}, '${escName}', '${escGenre}', '${a.monthly_listeners}')"><i class="fas fa-edit"></i> Edit</span>
                        <button class="delete-btn" onclick="deleteMusicItem('artists', ${a.id})"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function setupArtistEdit(id, name, genre, listeners) {
    currentEditingArtistId = id;
    document.getElementById('artistName').value = name;
    document.getElementById('artistGenre').value = genre;
    document.getElementById('artistListeners').value = listeners;
    
    const targetForm = document.getElementById('artistForm');
    if(targetForm) targetForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --- SUB-CONTROLLER: ALBUMS REPOSITORY --- */
function renderAlbums() {
    const db = getMusicData();
    const tbody = document.querySelector('#albumTable tbody');
    if (!tbody) return;

    tbody.innerHTML = db.albums.map(a => {
        const escName = a.name.replace(/'/g, "\\'");
        return `
            <tr>
                <td style="color: var(--primary-orange); font-weight: bold;">#0${a.id}</td>
                <td style="font-weight: 500; color: #fff;"><i class="fas fa-compact-disc" style="color: var(--primary-orange); margin-right: 8px;"></i> ${a.name}</td>
                <td>${a.release_year}</td>
                <td style="color: rgba(255,255,255,0.4); font-family: monospace;">ARTIST_ID: #${a.artist_id}</td>
                <td>
                    <div class="action-btns">
                        <span class="edit-link" onclick="setupAlbumEdit(${a.id}, '${escName}', '${a.release_year}', '${a.artist_id}')"><i class="fas fa-edit"></i> Edit</span>
                        <button class="delete-btn" onclick="deleteMusicItem('albums', ${a.id})"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function setupAlbumEdit(id, name, year, artistId) {
    currentEditingAlbumId = id;
    document.getElementById('albumName').value = name;
    document.getElementById('albumYear').value = year;
    document.getElementById('artistId').value = artistId;
    
    const targetForm = document.getElementById('albumForm');
    if(targetForm) targetForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --- SUB-CONTROLLER: SONGS REPOSITORY --- */
function renderSongs() {
    const db = getMusicData();
    const tbody = document.querySelector('#songTable tbody');
    if (!tbody) return;

    tbody.innerHTML = db.songs.map(s => {
        const escName = s.name.replace(/'/g, "\\'");
        return `
            <tr>
                <td style="color: var(--primary-orange); font-weight: bold;">#0${s.id}</td>
                <td style="font-weight: 500; color: #fff;"><i class="fas fa-sliders" style="color: rgba(255,255,255,0.4); margin-right: 8px;"></i> ${s.name}</td>
                <td>${s.release_year}</td>
                <td style="color: rgba(255,255,255,0.4); font-family: monospace;">ALBUM_ID: #${s.album_id}</td>
                <td>
                    <div class="action-btns">
                        <span class="edit-link" onclick="setupSongEdit(${s.id}, '${escName}', '${s.release_year}', '${s.album_id}')"><i class="fas fa-edit"></i> Edit</span>
                        <button class="delete-btn" onclick="deleteMusicItem('songs', ${s.id})"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function setupSongEdit(id, name, year, albumId) {
    currentEditingSongId = id;
    document.getElementById('songName').value = name;
    document.getElementById('songYear').value = year;
    document.getElementById('albumId').value = albumId;
    
    const targetForm = document.getElementById('songForm');
    if(targetForm) targetForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --- GLOBAL FORM LIFECYCLE LISTENERS --- */
document.addEventListener("DOMContentLoaded", () => {
    // Render initial state mapping down into targets
    renderArtists();
    renderAlbums();
    renderSongs();

    // 1. Artists Input Processing Pipeline
    const artistForm = document.getElementById('artistForm');
    if (artistForm) {
        artistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const db = getMusicData();
            const newArtist = {
                id: db.artists.length > 0 ? Math.max(...db.artists.map(a => a.id)) + 1 : 1,
                name: document.getElementById('artistName').value.trim(),
                genre: document.getElementById('artistGenre').value.trim(),
                monthly_listeners: document.getElementById('artistListeners').value || "0"
            };
            db.artists.push(newArtist);
            saveMusicData(db);
            artistForm.reset();
            renderArtists();
        });

        const updateArtistBtn = document.getElementById('updateArtistBtn');
        if (updateArtistBtn) {
            updateArtistBtn.addEventListener('click', () => {
                if (!currentEditingArtistId) return alert("Please select an artist from the table roster via 'Edit' links first.");
                const db = getMusicData();
                const idx = db.artists.findIndex(a => a.id === currentEditingArtistId);
                if (idx !== -1) {
                    db.artists[idx].name = document.getElementById('artistName').value.trim();
                    db.artists[idx].genre = document.getElementById('artistGenre').value.trim();
                    db.artists[idx].monthly_listeners = document.getElementById('artistListeners').value;
                    saveMusicData(db);
                    artistForm.reset();
                    currentEditingArtistId = null;
                    renderArtists();
                }
            });
        }
    }

    // 2. Albums Deck Processing Pipeline
    const albumForm = document.getElementById('albumForm');
    if (albumForm) {
        albumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Trigger beautiful CSS animation rotation sequences on the inputs
            const decks = document.querySelectorAll('.vinyl-input');
            decks.forEach(d => d.classList.add('spinning'));
            setTimeout(() => decks.forEach(d => d.classList.remove('spinning')), 800);

            const db = getMusicData();
            const newAlbum = {
                id: db.albums.length > 0 ? Math.max(...db.albums.map(a => a.id)) + 1 : 1,
                name: document.getElementById('albumName').value.trim(),
                release_year: document.getElementById('albumYear').value,
                artist_id: document.getElementById('artistId').value
            };
            db.albums.push(newAlbum);
            saveMusicData(db);
            albumForm.reset();
            renderAlbums();
        });

        const updateAlbumBtn = document.getElementById('updateAlbumBtn');
        if (updateAlbumBtn) {
            updateAlbumBtn.addEventListener('click', () => {
                if (!currentEditingAlbumId) return alert("Select an album instance record to update first.");
                const db = getMusicData();
                const idx = db.albums.findIndex(a => a.id === currentEditingAlbumId);
                if (idx !== -1) {
                    db.albums[idx].name = document.getElementById('albumName').value.trim();
                    db.albums[idx].release_year = document.getElementById('albumYear').value;
                    db.albums[idx].artist_id = document.getElementById('artistId').value;
                    saveMusicData(db);
                    albumForm.reset();
                    currentEditingAlbumId = null;
                    renderAlbums();
                }
            });
        }
    }

    // 3. Songs Matrix Mixer Pipeline
    const songForm = document.getElementById('songForm');
    if (songForm) {
        songForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const db = getMusicData();
            const newSong = {
                id: db.songs.length > 0 ? Math.max(...db.songs.map(s => s.id)) + 1 : 1,
                name: document.getElementById('songName').value.trim(),
                release_year: document.getElementById('songYear').value,
                album_id: document.getElementById('albumId').value
            };
            db.songs.push(newSong);
            saveMusicData(db);
            songForm.reset();
            renderSongs();
        });

        const updateSongBtn = document.getElementById('updateSongBtn');
        if (updateSongBtn) {
            updateSongBtn.addEventListener('click', () => {
                if (!currentEditingSongId) return alert("Select an audio song track via table edit triggers first.");
                const db = getMusicData();
                const idx = db.songs.findIndex(s => s.id === currentEditingSongId);
                if (idx !== -1) {
                    db.songs[idx].name = document.getElementById('songName').value.trim();
                    db.songs[idx].release_year = document.getElementById('songYear').value;
                    db.songs[idx].album_id = document.getElementById('albumId').value;
                    saveMusicData(db);
                    songForm.reset();
                    currentEditingSongId = null;
                    renderSongs();
                }
            });
        }
    }
});

/* --- DELETION UTILITY PIPELINE --- */
function deleteMusicItem(collection, id) {
    if (confirm(`Are you sure you want to drop this record from the active ${collection} stack?`)) {
        const db = getMusicData();
        db[collection] = db[collection].filter(item => item.id !== id);
        saveMusicData(db);
        
        if (collection === 'artists') renderArtists();
        if (collection === 'albums') renderAlbums();
        if (collection === 'songs') renderSongs();
    }
}

/* --- SPA SECTION TAB ROUTER CONTROLLER --- */
function showSection(id) {
    // Hide active instances
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    // Mount desired card section view
    const targetSection = document.getElementById(id);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Manage dynamic navigation link focus active tracking
    document.querySelectorAll('nav ul li a').forEach(a => a.style.borderColor = 'transparent');
    const activeLink = document.querySelector(`nav ul li a[href="#${id}"]`);
    if (activeLink) {
        activeLink.style.borderColor = 'var(--primary-orange)';
    }
}

// Bind functions securely onto the global client window environment context
window.showSection = showSection;
window.deleteMusicItem = deleteMusicItem;
window.setupArtistEdit = setupArtistEdit;
window.setupAlbumEdit = setupAlbumEdit;
window.setupSongEdit = setupSongEdit;