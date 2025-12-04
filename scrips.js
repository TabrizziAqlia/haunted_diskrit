// =======================================================
// KONFIGURASI HANTU DAN PROPOSISI
// =======================================================

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
    username: "Pemain", 
    hantuName: "Hantu Logika" 
};


// =======================================================
// STRUKTUR QUEST/TASK (Pastikan ini utuh dan lengkap)
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
    2: [ 
        {
            task: 1,
            title: "Kunci 4: Jendela Tertutup (Implikasi)",
            narrative: "Aturan Hantu: Kamu aman **JIKA (P → Q)**. Logika: **JIKA Pintu terkunci (P), MAKA Jendela Tertutup (Q)**. Situasi: Pintu terkunci (**P: T**), tetapi Jendela terbuka (**Q: F**).",
            propositions: { P: true, Q: false },
            logic: 'P → Q',
            answer: LOGIC_OPS['P → Q'](true, false),
            explanation: (p, q) => `Implikasi **P → Q** hanya bernilai **False** (melanggar aturan) JIKA sebab (P) True dan akibat (Q) False. Karena P=T dan Q=F, hasilnya adalah **${toStr(LOGIC_OPS['P → Q'](p, q))}**.`,
        },
        {
            task: 2,
            title: "Kunci 5: Ruangan Aman (Biimplikasi)",
            narrative: "Ruangan ini aman (**SELAMAT**) **JIKA dan HANYA JIKA (P ↔ Q)** kondisinya setara. Situasi: Lampu Mati (**P: F**), Pintu Terbuka (**Q: F**).",
            propositions: { P: false, Q: false },
            logic: 'P ↔ Q',
            answer: LOGIC_OPS['P ↔ Q'](false, false),
            explanation: (p, q) => `Biimplikasi **P ↔ Q** bernilai **True** JIKA dan HANYA JIKA P dan Q memiliki nilai kebenaran yang **sama**. Karena P=F dan Q=F, hasilnya adalah **${toStr(LOGIC_OPS['P ↔ Q'](p, q))}**.`,
        },
        {
            task: 3,
            title: "Kunci 6: Rantai Keputusan",
            narrative: "Tentukan nilai Logika Implikasi: **(Lampu menyala → Pintu terkunci)**. Situasi: Lampu menyala (**P: T**) dan Pintu terkunci (**Q: T**).",
            propositions: { P: true, Q: true },
            logic: 'P → Q',
            answer: LOGIC_OPS['P → Q'](true, true),
            explanation: (p, q) => `Implikasi **P → Q** bernilai **True** ketika P=T dan Q=T. Kondisi sebab dan akibat terpenuhi. Hasilnya adalah **${toStr(LOGIC_OPS['P → Q'](p, q))}**.`,
        },
    ],
    3: [ 
        {
            task: 1,
            title: "Kunci 7: Tautologi (Kebenaran Universal)",
            narrative: "Aksi yang **SELALU BENAR (Tautologi)** akan menyelamatkanmu: **P ∨ ¬P**. Tentukan hasil logika ini. (Situasi P=True).",
            propositions: { P: true },
            logic: 'P ∨ ¬P',
            answer: true, 
            explanation: (p) => `Ekspresi **P ∨ ¬P** (P atau Bukan P) adalah **Tautologi**, yang berarti hasilnya **selalu True**, terlepas dari nilai P.`,
        },
        {
            task: 2,
            title: "Kunci 8: Kontradiksi (Kelemahan Hantu)",
            narrative: "Hantu akan melemah **JIKA** logikanya **SELALU SALAH (Kontradiksi)**: **P ∧ ¬P**. Tentukan hasil logika ini. (Situasi P=False).",
            propositions: { P: false },
            logic: 'P ∧ ¬P',
            answer: false, 
            explanation: (p) => `Ekspresi **P ∧ ¬P** (P dan Bukan P) adalah **Kontradiksi**, yang berarti hasilnya **selalu False**, terlepas dari nilai P.`,
        },
        {
            task: 3,
            title: "Kunci 9: Implikasi Tersembunyi",
            narrative: "Tentukan nilai Logika Rumit: **(P ↔ Q) → (P ∨ Q)**. Situasi: P=T, Q=T.",
            propositions: { P: true, Q: true },
            logic: '(P ↔ Q) → (P ∨ Q)',
            answer: true,
            explanation: (p, q) => {
                const p_bi_q = LOGIC_OPS['P ↔ Q'](p, q); 
                const p_or_q = LOGIC_OPS['P ∨ Q'](p, q); 
                const hasil = LOGIC_OPS['P → Q'](p_bi_q, p_or_q); 
                return `Logika dipecah: 1. (P ↔ Q) adalah ${toStr(p_bi_q)}. 2. (P ∨ Q) adalah ${toStr(p_or_q)}. 3. Hasil akhirnya (Implikasi) ${toStr(p_bi_q)} → ${toStr(p_or_q)} adalah **${toStr(hasil)}**.`;
            }
        }
    ]
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
    const gameContentArea = document.getElementById('game-content-area');

    if (!gameContentArea) {
        console.error("Elemen 'game-content-area' tidak ditemukan. Gagal memuat UI.");
        return; // Hentikan fungsi jika elemen tidak ada
    }

    const healthBar = '❤️'.repeat(gameState.health) + '💀'.repeat(3 - gameState.health);
    const currentQuest = QUESTS[gameState.currentLevel] ? QUESTS[gameState.currentLevel][gameState.currentTask - 1] : null;

    // Update Menu (Unlock Level) - Pengecekan keamanan
    const level2Btn = document.getElementById('level-2-btn');
    const level3Btn = document.getElementById('level-3-btn');
    if (level2Btn) level2Btn.disabled = !gameState.levelProgress[1];
    if (level3Btn) level3Btn.disabled = !gameState.levelProgress[2];

    if (!currentQuest) {
        // Tampilan Menang Total
        gameContentArea.innerHTML = `
            <h2>🏆 SELAMAT! KAMU MENANG! 🏆</h2>
            <p>Kamu telah menaklukkan ${gameState.hantuName} dan Logika Proposisional. Logikamu sangat kuat!</p>
            <button id="restart-final-btn" onclick="location.reload()">Mulai Game Baru</button>
        `;
        return;
    }
    
    // Logika menampilkan Task
    const P = currentQuest.propositions.P;
    const SecondProp = currentQuest.propositions.Q !== undefined ? currentQuest.propositions.Q : currentQuest.propositions.R;
    
    let variableDisplay = `**P=${toStr(P)}**`;
    if (currentQuest.propositions.Q !== undefined) variableDisplay += `, **Q=${toStr(currentQuest.propositions.Q)}**`;
    if (currentQuest.propositions.R !== undefined) variableDisplay += `, **R=${toStr(currentQuest.propositions.R)}**`;

    const logicDisplay = currentQuest.logic.replace(/R/g, 'Q');

    gameContentArea.innerHTML = `
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
    
    // Pengecekan keamanan
    if (!currentQuest || !feedbackArea) return; 

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
