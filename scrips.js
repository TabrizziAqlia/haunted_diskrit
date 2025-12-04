// =======================================================
// KONFIGURASI HANTU DAN PROPOSISI (DISIMPAN, TAPI TIDAK DIPAKAI LAGI)
// =======================================================

// Data HANTU_MAPPING dan LOGIC_OPS tetap disimpan
const LOGIC_OPS = {
    '¬P': (p, q) => !p,
    'P ∧ Q': (p, q) => p && q,
    'P ∨ Q': (p, q) => p || q,
    'P → Q': (p, q) => (!p) || q, 
    'P ↔ Q': (p, q) => p === q
};

const toStr = (val) => val ? 'T' : 'F'; 
const toAction = (val) => val ? 'SELAMAT (Lari)' : 'GAGAL (Berhenti)';

// =======================================================
// GAME STATE
// =======================================================
let gameState = {
    currentLevel: 1,
    currentTask: 1,
    maxTasks: 3,
    health: 3,
    levelProgress: { 1: false, 2: false, 3: false },
    username: "Pemain", // Default name karena tidak ada login
    hantuName: "Hantu Logika" // Default hantu
};


// =======================================================
// STRUKTUR QUEST/TASK (Sama seperti sebelumnya)
// =======================================================

const QUESTS = {
    1: [ 
        {
            task: 1,
            title: "Kunci 1: Lampu & Pintu (Konjungsi)",
            narrative: "Di lorong gelap, kamu harus **Lari (SELAMAT) jika Lampu menyala (P) DAN Pintu terkunci (Q)**. Situasi saat ini: Lampu menyala (**P: T**), tapi Pintu tidak terkunci (**Q: F**).",
            propositions: { P: true, Q: false },
            logic: 'P ∧ Q',
            answer: LOGIC_OPS['P ∧ Q'](true, false),
            explanation: (p, q) => `Konjungsi **P ∧ Q** hanya bernilai **True** jika **kedua** proposisi bernilai True. Karena Lampu menyala (P=T) dan Pintu tidak terkunci (Q=F), hasilnya adalah **${toStr(LOGIC_OPS['P ∧ Q'](p, q))}**.`,
        },
        {
            task: 2,
            title: "Kunci 2: Pintu atau Suara (Disjungsi)",
            narrative: "Kunci keselamatanmu: **Lari (SELAMAT) jika Pintu terkunci (Q) ATAU ada Suara aneh (R)**. Situasi: Pintu terbuka (**Q: F**), Suara aneh terdengar (**R: T**).",
            propositions: { Q: false, R: true },
            logic: 'Q ∨ R',
            answer: LOGIC_OPS['P ∨ Q'](false, true), 
            explanation: (q, r) => `Disjungsi **Q ∨ R** bernilai **True** jika **setidaknya satu** proposisi bernilai True. Karena Suara aneh terdengar (R=T), hasilnya adalah **${toStr(LOGIC_OPS['P ∨ Q'](q, r))}**.`,
        },
        {
            task: 3,
            title: "Kunci 3: Keluar Cepat (Negasi)",
            narrative: "Kamu hanya akan selamat jika **Lampu TIDAK menyala (¬P)**. Situasi: Lampu menyala (**P: T**).",
            propositions: { P: true },
            logic: '¬P',
            answer: LOGIC_OPS['¬P'](true),
            explanation: (p) => `Negasi **¬P** membalik nilai P. Karena Lampu menyala (P=T), maka ¬P adalah **${toStr(LOGIC_OPS['¬P'](p))}** (False).`,
        },
    ],
    // Level 2 dan 3 tetap sama
    2: [ /* ... Quest 4, 5, 6 */ ],
    3: [ /* ... Quest 7, 8, 9 */ ],
};


// =======================================================
// FUNGSI NAVIGASI & START
// =======================================================

function nextTask() {
    gameState.currentTask++;
    
    if (gameState.currentTask > gameState.maxTasks) {
        gameState.levelProgress[gameState.currentLevel] = true;
        gameState.currentLevel++;
        gameState.currentTask = 1;

        if (gameState.currentLevel <= 3) {
            alert(`Level ${gameState.currentLevel - 1} Selesai! Selamat datang di Level ${gameState.currentLevel}.`);
        }
    }
    updateUI();
}

function startGame(level) {
    if (level > 1 && !gameState.levelProgress[level - 1]) {
        alert(`Selesaikan Level ${level - 1} terlebih dahulu!`);
        return;
    }
    
    gameState.currentLevel = level;
    gameState.currentTask = 1;
    gameState.health = 3; 
    // Panggil updateUI untuk memuat task pertama
    updateUI(); 
}

function gameOver() {
    document.getElementById('game-content-area').innerHTML = `
        <h2>☠️ GAME OVER ☠️</h2>
        <p>Logikamu gagal. ${gameState.hantuName} menangkapmu!</p>
        <button onclick="location.reload()">Coba Lagi (Restart)</button>
    `;
}

// =======================================================
// FUNGSI UI & CHECK JAWABAN
// =======================================================

function updateUI() {
    const healthBar = '❤️'.repeat(gameState.health) + '💀'.repeat(3 - gameState.health);
    const currentQuest = QUESTS[gameState.currentLevel] ? QUESTS[gameState.currentLevel][gameState.currentTask - 1] : null;

    // Update Menu (Unlock Level)
    document.getElementById('level-2-btn').disabled = !gameState.levelProgress[1];
    document.getElementById('level-3-btn').disabled = !gameState.levelProgress[2];

    if (!currentQuest) {
        // Tampilan Menang Total
        document.getElementById('game-content-area').innerHTML = `
            <h2>🏆 SELAMAT! KAMU MENANG! 🏆</h2>
            <p>Kamu telah menaklukkan ${gameState.hantuName} dan Logika Proposisional. Logikamu sangat kuat!</p>
            <button id="restart-final-btn" onclick="location.reload()">Mulai Game Baru</button>
        `;
        return;
    }
    
    // Perubahan Penting: Jika Task 1, tampilkan Task 1. TIDAK ADA LAGI LOGIKA LOBBY.
    // Jika tombol Start dipanggil, langsung lompat ke sini:
    

    const P = currentQuest.propositions.P;
    const SecondProp = currentQuest.propositions.Q !== undefined ? currentQuest.propositions.Q : currentQuest.propositions.R;
    
    let variableDisplay = `**P=${toStr(P)}**`;
    if (currentQuest.propositions.Q !== undefined) variableDisplay += `, **Q=${toStr(currentQuest.propositions.Q)}**`;
    if (currentQuest.propositions.R !== undefined) variableDisplay += `, **R=${toStr(currentQuest.propositions.R)}**`;

    const logicDisplay = currentQuest.logic.replace(/R/g, 'Q');

    document.getElementById('game-content-area').innerHTML = `
        <div class="status-bar">
            <span>Level: ${gameState.currentLevel} / 3</span>
            <span>Task: ${gameState.currentTask} / ${gameState.maxTasks}</span>
            <span class="health">Health: ${healthBar}</span>
        </div>

        <h2>Task ${currentQuest.task}: ${currentQuest.title}</h2>
        
        <div class="logika-highlight">
            <p>🔑 Logika Kunci: **$${logicDisplay}$**</p> 
            <p>Variabel Situasi: ${variableDisplay} </p>
        </div>
        
        <div class="narrative-box">
             <p> **NARASI SITUASI:** ${currentQuest.narrative}</p>
        </div>
       
        <p><h3>Pilih Hasil Logika Kunci ($${logicDisplay}$) untuk **SELAMAT**:</h3></p>
        <div class="options-container">
            <button id="btn-true" onclick="checkAnswer(true)">True (T) / Lari</button>
            <button id="btn-false" onclick="checkAnswer(false)">False (F) / Berhenti</button>
        </div>

        <div id="feedback-area" class="feedback default">Pilih salah satu jawaban di atas.</div>
    `;

    // Merender ulang MathJax setiap kali UI diperbarui
    if (window.MathJax) {
        window.MathJax.typeset();
    }
}

function checkAnswer(userAnswer) {
    const currentQuest = QUESTS[gameState.currentLevel][gameState.currentTask - 1];
    const feedbackArea = document.getElementById('feedback-area');
    
    document.getElementById('btn-true').disabled = true;
    document.getElementById('btn-false').disabled = true;

    const P = currentQuest.propositions.P;
    const SecondProp = currentQuest.propositions.Q !== undefined ? currentQuest.propositions.Q : currentQuest.propositions.R;

    const explanationText = currentQuest.explanation(P, SecondProp);

    let explanationHTML = `
        <div style="margin-top: 10px; padding: 10px; border-radius: 5px; text-align: left;">
            <p>💡 **PENJELASAN LOGIKA:**</p>
            <p>${explanationText}</p>
        </div>
    `;

    if (userAnswer === currentQuest.answer) {
        // Jawaban Benar
        feedbackArea.className = "feedback correct";
        feedbackArea.innerHTML = `
            ✅ **BENAR!** Kamu berhasil. Keputusan tepat adalah **${toAction(userAnswer)}**.
            ${explanationHTML}
            <button class="next-btn correct" onclick="nextTask()">LANJUT (Next Task)</button>
        `;

    } else {
        // Jawaban Salah
        gameState.health--;
        
        let nextAction = "";
        if (gameState.health <= 0) {
            nextAction = `<button class="next-btn wrong" onclick="gameOver()">GAME OVER</button>`;
        } else {
            nextAction = `<button class="next-btn wrong" onclick="updateUI()">COBA LAGI (Lanjut Task yang Sama)</button>`;
        }

        feedbackArea.className = "feedback wrong";
        feedbackArea.innerHTML = `
            ❌ **SALAH!** Itu adalah keputusan yang salah. Kamu kehilangan 1 Health.
            <p>Jawaban yang benar seharusnya **${toStr(currentQuest.answer)}** (${toAction(currentQuest.answer)}).</p>
            ${explanationHTML}
            ${nextAction}
        `;
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Karena tidak ada login, pastikan tampilan awal adalah Lobby.
    // Tidak ada fungsi startGame(1) di sini, biarkan tombol START GAME yang memanggilnya.
});
