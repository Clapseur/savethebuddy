 // Types de câbles possibles
 const WIRE_TYPES = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    TOP_RIGHT: 2,
    TOP_LEFT: 3,
    CROSS: 4,
    T_UP: 5,
    T_RIGHT: 6
};

// Directions
const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

// Configuration du jeu
const config = {
    rows: 5,
    cols: 5,
    batteryPos: { row: 0, col: 0 },
    shieldPos: { row: 4, col: 4 },
    maxTime: 300 // 5 minutes en secondes
};

// État du jeu
let gameState = {
    grid: [],
    connected: false,
    poweredCells: [],
    moves: 0,
    time: 0,
    timerInterval: null,
    gameActive: true
};

// Initialisation du jeu
function initGame() {
    // Réinitialiser l'état du jeu
    gameState.grid = [];
    gameState.connected = false;
    gameState.poweredCells = [];
    gameState.moves = 0;
    gameState.time = 0;
    gameState.gameActive = true;
    
    // Mettre à jour l'interface
    document.getElementById('moves').textContent = '0';
    document.getElementById('time').textContent = '00:00';
    document.getElementById('endScreen').style.display = 'none';
    
    // Arrêter le timer précédent s'il existe
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Démarrer le nouveau timer
    startTimer();
    
    const gridElement = document.getElementById('gameGrid');
    gridElement.innerHTML = '';
    
    // Création de la grille
    for (let row = 0; row < config.rows; row++) {
        gameState.grid[row] = [];
        for (let col = 0; col < config.cols; col++) {
            // Position de la batterie
            if (row === config.batteryPos.row && col === config.batteryPos.col) {
                gameState.grid[row][col] = { type: 'battery', rotation: 0 };
                continue;
            }
            
            // Position du bouclier
            if (row === config.shieldPos.row && col === config.shieldPos.col) {
                gameState.grid[row][col] = { type: 'shield', rotation: 0 };
                continue;
            }
            
            // Cases vides aléatoires
            if (Math.random() < 0.2) {
                gameState.grid[row][col] = null;
                continue;
            }
            
            // Cases avec câbles
            const randomType = getWeightedRandomType();
            gameState.grid[row][col] = { 
                type: 'wire', 
                wireType: randomType, 
                rotation: Math.floor(Math.random() * 4)
            };
        }
    }
    
    renderGrid();
    checkConnection();
}

// Démarrer le timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameActive) return;
        
        gameState.time++;
        updateTimerDisplay();
        
        // Vérifier si le temps est écoulé
        if (gameState.time >= config.maxTime) {
            endGame(false);
        }
    }, 1000);
}

// Mettre à jour l'affichage du timer
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.time / 60).toString().padStart(2, '0');
    const seconds = (gameState.time % 60).toString().padStart(2, '0');
    document.getElementById('time').textContent = `${minutes}:${seconds}`;
}

// Obtient un type de câble aléatoire avec pondération
function getWeightedRandomType() {
    const types = [
        WIRE_TYPES.HORIZONTAL,
        WIRE_TYPES.VERTICAL,
        WIRE_TYPES.TOP_RIGHT,
        WIRE_TYPES.TOP_LEFT,
        WIRE_TYPES.CROSS,
        WIRE_TYPES.T_UP,
        WIRE_TYPES.T_RIGHT
    ];
    
    // Plus de chances d'avoir des câbles simples que des croisements
    const weights = [0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.1];
    
    let random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < types.length; i++) {
        sum += weights[i];
        if (random <= sum) return types[i];
    }
    
    return WIRE_TYPES.HORIZONTAL;
}

// Affichage de la grille
function renderGrid() {
    const gridElement = document.getElementById('gameGrid');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Vérifier si la cellule est alimentée
            if (gameState.poweredCells.some(pos => pos.row === row && pos.col === col)) {
                cell.classList.add('powered');
            }
            
            const item = gameState.grid[row][col];
            
            if (item === null) {
                cell.textContent = '';
            } else if (item.type === 'battery') {
                cell.classList.add('battery');
                cell.textContent = '🔋';
            } else if (item.type === 'shield') {
                cell.classList.add('shield');
                cell.textContent = '🛡️';
            } else if (item.type === 'wire') {
                const wireDiv = document.createElement('div');
                wireDiv.className = 'wire';
                
                // Affichage du câble en fonction de son type et rotation
                const effectiveType = getEffectiveWireType(item);
                
                if (effectiveType === WIRE_TYPES.HORIZONTAL) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-horizontal';
                    wireDiv.appendChild(wire);
                } else if (effectiveType === WIRE_TYPES.VERTICAL) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-vertical';
                    wireDiv.appendChild(wire);
                } else if (effectiveType === WIRE_TYPES.TOP_RIGHT) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-top-right';
                    wireDiv.appendChild(wire);
                } else if (effectiveType === WIRE_TYPES.TOP_LEFT) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-top-left';
                    wireDiv.appendChild(wire);
                } else if (effectiveType === WIRE_TYPES.CROSS) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-cross';
                    wireDiv.appendChild(wire);
                } else if (effectiveType === WIRE_TYPES.T_UP) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-t-up';
                    wireDiv.appendChild(wire);
                } else if (effectiveType === WIRE_TYPES.T_RIGHT) {
                    const wire = document.createElement('div');
                    wire.className = 'wire-part wire-t-right';
                    wireDiv.appendChild(wire);
                }
                
                cell.appendChild(wireDiv);
            }
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            gridElement.appendChild(cell);
        }
    }
}

// Obtient le type effectif du câble en fonction de sa rotation
function getEffectiveWireType(item) {
    if (item.wireType === WIRE_TYPES.CROSS || item.wireType === WIRE_TYPES.T_UP || item.wireType === WIRE_TYPES.T_RIGHT) {
        return item.wireType; // Les croisements et T ne changent pas avec la rotation
    }
    
    return (item.wireType + item.rotation) % 4;
}

// Gestion du clic sur une cellule
function handleCellClick(row, col) {
    if (!gameState.gameActive) return;
    
    const item = gameState.grid[row][col];
    
    if (item && item.type === 'wire') {
        // Rotation du câble
        item.rotation = (item.rotation + 1) % 4;
        gameState.moves++;
        document.getElementById('moves').textContent = gameState.moves;
        renderGrid();
        checkConnection();
    }
}

// Vérification de la connexion entre la batterie et le bouclier
function checkConnection() {
    const visited = Array(config.rows).fill().map(() => Array(config.cols).fill(false));
    let connected = false;
    gameState.poweredCells = [];
    
    function dfs(row, col, fromDirection) {
        if (row < 0 || row >= config.rows || col < 0 || col >= config.cols || visited[row][col]) {
            return;
        }
        
        const item = gameState.grid[row][col];
        if (!item) return;
        
        // Marquer comme visité et alimenté
        visited[row][col] = true;
        gameState.poweredCells.push({ row, col });
        
        // Arrivé au bouclier
        if (item.type === 'shield') {
            // Vérifier la connexion depuis la bonne direction
            if (fromDirection === DIRECTIONS.UP && hasConnection(item, DIRECTIONS.DOWN, row, col) ||
                fromDirection === DIRECTIONS.RIGHT && hasConnection(item, DIRECTIONS.LEFT, row, col) ||
                fromDirection === DIRECTIONS.DOWN && hasConnection(item, DIRECTIONS.UP, row, col) ||
                fromDirection === DIRECTIONS.LEFT && hasConnection(item, DIRECTIONS.RIGHT, row, col)) {
                connected = true;
            }
            return;
        }
        
        // Batterie - toujours connectée vers le bas et la droite
        if (item.type === 'battery') {
            dfs(row + 1, col, DIRECTIONS.UP);
            dfs(row, col + 1, DIRECTIONS.LEFT);
            return;
        }
        
        // Câbles normaux
        const effectiveType = getEffectiveWireType(item);
        
        // Déterminer les directions de sortie en fonction de la direction d'entrée
        let exitDirections = [];
        
        if (effectiveType === WIRE_TYPES.HORIZONTAL) {
            if (fromDirection === DIRECTIONS.LEFT) exitDirections.push(DIRECTIONS.RIGHT);
            if (fromDirection === DIRECTIONS.RIGHT) exitDirections.push(DIRECTIONS.LEFT);
        } else if (effectiveType === WIRE_TYPES.VERTICAL) {
            if (fromDirection === DIRECTIONS.UP) exitDirections.push(DIRECTIONS.DOWN);
            if (fromDirection === DIRECTIONS.DOWN) exitDirections.push(DIRECTIONS.UP);
        } else if (effectiveType === WIRE_TYPES.TOP_RIGHT) {
            if (fromDirection === DIRECTIONS.UP) exitDirections.push(DIRECTIONS.RIGHT);
            if (fromDirection === DIRECTIONS.RIGHT) exitDirections.push(DIRECTIONS.UP);
        } else if (effectiveType === WIRE_TYPES.TOP_LEFT) {
            if (fromDirection === DIRECTIONS.UP) exitDirections.push(DIRECTIONS.LEFT);
            if (fromDirection === DIRECTIONS.LEFT) exitDirections.push(DIRECTIONS.UP);
        } else if (effectiveType === WIRE_TYPES.CROSS) {
            // Croisement - toutes les directions sauf celle d'où on vient
            if (fromDirection !== DIRECTIONS.UP) exitDirections.push(DIRECTIONS.DOWN);
            if (fromDirection !== DIRECTIONS.RIGHT) exitDirections.push(DIRECTIONS.LEFT);
            if (fromDirection !== DIRECTIONS.DOWN) exitDirections.push(DIRECTIONS.UP);
            if (fromDirection !== DIRECTIONS.LEFT) exitDirections.push(DIRECTIONS.RIGHT);
        } else if (effectiveType === WIRE_TYPES.T_UP) {
            // T vers le haut - toutes sauf le bas
            if (fromDirection !== DIRECTIONS.UP) exitDirections.push(DIRECTIONS.DOWN);
            if (fromDirection !== DIRECTIONS.RIGHT) exitDirections.push(DIRECTIONS.LEFT);
            if (fromDirection !== DIRECTIONS.LEFT) exitDirections.push(DIRECTIONS.RIGHT);
        } else if (effectiveType === WIRE_TYPES.T_RIGHT) {
            // T vers la droite - toutes sauf la gauche
            if (fromDirection !== DIRECTIONS.UP) exitDirections.push(DIRECTIONS.DOWN);
            if (fromDirection !== DIRECTIONS.RIGHT) exitDirections.push(DIRECTIONS.LEFT);
            if (fromDirection !== DIRECTIONS.DOWN) exitDirections.push(DIRECTIONS.UP);
        }
        
        // Explorer les directions de sortie
        for (const dir of exitDirections) {
            if (dir === DIRECTIONS.UP) dfs(row - 1, col, DIRECTIONS.DOWN);
            if (dir === DIRECTIONS.RIGHT) dfs(row, col + 1, DIRECTIONS.LEFT);
            if (dir === DIRECTIONS.DOWN) dfs(row + 1, col, DIRECTIONS.UP);
            if (dir === DIRECTIONS.LEFT) dfs(row, col - 1, DIRECTIONS.RIGHT);
        }
    }
    
    // Commencer depuis la batterie
    dfs(config.batteryPos.row, config.batteryPos.col, null);
    
    gameState.connected = connected;
    updateStatus();
    renderGrid(); // Re-render pour afficher les cellules alimentées
    
    // Vérifier si le joueur a gagné
    if (connected) {
        endGame(true);
    }
}

// Fin du jeu
function endGame(success) {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    
    const endScreen = document.getElementById('endScreen');
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    
    // Mettre à jour les statistiques finales
    const minutes = Math.floor(gameState.time / 60).toString().padStart(2, '0');
    const seconds = (gameState.time % 60).toString().padStart(2, '0');
    document.getElementById('finalTime').textContent = `${minutes}:${seconds}`;
    document.getElementById('finalMoves').textContent = gameState.moves;
    
    if (success) {
        endTitle.textContent = 'Mission Accomplie!';
        endTitle.className = 'end-title success';
        endMessage.textContent = 'Vous avez réussi à alimenter le bouclier!';
    } else {
        endTitle.textContent = 'Temps Écoulé!';
        endTitle.className = 'end-title failure';
        endMessage.textContent = 'Vous n\'avez pas réussi à temps. Essayez encore!';
    }
    
    endScreen.style.display = 'flex';
}

// Vérifie si un élément a une connexion dans une direction donnée
function hasConnection(item, direction, row, col) {
    if (item.type === 'battery') {
        return direction === null || direction === DIRECTIONS.DOWN || direction === DIRECTIONS.RIGHT;
    }
    
    if (item.type === 'shield') {
        return direction === DIRECTIONS.UP || direction === DIRECTIONS.LEFT;
    }
    
    if (item.type === 'wire') {
        const effectiveType = getEffectiveWireType(item);
        
        if (effectiveType === WIRE_TYPES.HORIZONTAL) {
            return direction === DIRECTIONS.LEFT || direction === DIRECTIONS.RIGHT;
        } else if (effectiveType === WIRE_TYPES.VERTICAL) {
            return direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN;
        } else if (effectiveType === WIRE_TYPES.TOP_RIGHT) {
            return direction === DIRECTIONS.UP || direction === DIRECTIONS.RIGHT;
        } else if (effectiveType === WIRE_TYPES.TOP_LEFT) {
            return direction === DIRECTIONS.UP || direction === DIRECTIONS.LEFT;
        } else if (effectiveType === WIRE_TYPES.CROSS) {
            return true; // Croisement accepte toutes les directions
        } else if (effectiveType === WIRE_TYPES.T_UP) {
            return direction !== DIRECTIONS.DOWN; // T vers le haut n'accepte pas le bas
        } else if (effectiveType === WIRE_TYPES.T_RIGHT) {
            return direction !== DIRECTIONS.LEFT; // T vers la droite n'accepte pas la gauche
        }
    }
    
    return false;
}

// Mise à jour du statut
function updateStatus() {
    const statusElement = document.getElementById('status');
    if (gameState.connected) {
        statusElement.textContent = 'Bouclier alimenté! Mission accomplie!';
        statusElement.style.color = '#4CAF50';
    } else {
        statusElement.textContent = 'Connectez la batterie au bouclier!';
        statusElement.style.color = 'white';
    }
}

// Écouteurs d'événements
document.getElementById('resetBtn').addEventListener('click', () => {
    if (!gameState.gameActive) return;
    
    // Réinitialise les rotations sans changer la configuration
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const item = gameState.grid[row][col];
            if (item && item.type === 'wire') {
                item.rotation = 0;
            }
        }
    }
    gameState.moves = 0;
    document.getElementById('moves').textContent = '0';
    renderGrid();
    checkConnection();
});

document.getElementById('newGameBtn').addEventListener('click', initGame);
document.getElementById('playAgainBtn').addEventListener('click', initGame);
document.getElementById('quitBtn').addEventListener('click', () => {
    document.getElementById('endScreen').style.display = 'none';
});

// Démarrer le jeu
initGame();
