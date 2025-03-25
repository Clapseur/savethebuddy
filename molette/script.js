
//& Timer 

// Début du timer à 31s
let time = 31;
let timer;

// Démarrer le chronomètre
function startTimer() {
  // Intervalle qui appelle la fonction myTimer toutes les 1000ms
  timer = setInterval(myTimer, 1000);
}

// Fonction exécutée chaque seconde pour mettre à jour le chronomètre
function myTimer() {
  time--; // Décrémente le temps
  
  // Met à jour l'affichage du chrono
  document.getElementById("chrono").innerHTML = time + "s";

  // Vérifie si le temps est écoulé
  if (time === 0) { 
    clearInterval(timer); // Arrête le chrono à 0
  }
}

// Redémarre au reload de la page
startTimer();



//& fonction "sonar"

// Sélectionne l'élément représentant l'aiguille de la boussole
const needle = document.querySelector('.needle');

// Sélectionne l'élément représentant la boussole
const compass = document.querySelector('.compass');

// Écoute l'événement de mouvement de la souris sur le document
document.addEventListener('mousemove', (event) => {
    // Obtient les coordonnées et dimensions de la boussole
    const rect = compass.getBoundingClientRect();

    // Calcule les coordonnées du centre de la boussole
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calcule la différence entre la position de la souris et le centre de la boussole
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    // Calcule l'angle de rotation en degrés en utilisant la fonction atan2
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Applique la transformation de rotation à l'aiguille de la boussole
    // La translation (-50%, -90%) est utilisée pour centrer correctement l'aiguille
    needle.style.transform = `translate(-50%, -90%) rotate(${angle}deg)`;
});


//& Ombres

// Les cercles
const container = document.querySelector('.container');

// Stocker les cercles créés
const circles = [];

// Positions (x, y) pour le placement des cercles
const positions = [
    [50, 100], [150, 50], [250, 100], [350, 150], [450, 200], [550, 150], [650, 100], [750, 50],
    [150, 200], [250, 250], [350, 300], [450, 300], [550, 250], [650, 200]
];

// Crée et place les cercles aux positions donnés
positions.forEach(([x, y]) => {
    const circle = document.createElement('div'); // Crée un élément div pour chaque cercle
    circle.classList.add('circle'); // Ajoute en CSS "circle"
    circle.style.left = `${x}px`; // Positionne horizontalement
    circle.style.top = `${y}px`; // Positionne verticalement
    container.appendChild(circle); // Ajoute le cercle 
    circles.push(circle); // Stocke le cercle dans le tableau
});

// Effet de lumière par rapp à la souris
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX; // Position horizontale de la souris

    circles.forEach(circle => {
        const rect = circle.getBoundingClientRect(); // Dimensions et position du cercle
        const distance = Math.abs(mouseX - rect.left); // Distance entre la souris et le cercle
        
        // Intensité de l'effet (réduction avec la distance)
        const intensity = Math.max(0, 100 - distance) / 100;

        //Ombres en fonction de l'intensité
        circle.style.boxShadow = `0 0 ${20 * intensity}px rgba(255, 0, 0, ${intensity})`;
    });
});
