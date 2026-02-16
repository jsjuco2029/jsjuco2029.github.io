const planets = document.querySelectorAll(".planet");
const startBtn = document.getElementById("startBtn");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const difficultySelect = document.getElementById("difficulty");
const timerBar = document.getElementById("timerBar");
const progressBar = document.getElementById("progressBar");
const message = document.getElementById("message");

let sequence = [];
let playerIndex = 0;
let level = 0;
let score = 0;
let timer;
let playing = false;
let maxLevel = 15;

let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

function getSettings(){
    if(difficultySelect.value==="easy") return {speed:800,timer:5000,multiplier:1};
    if(difficultySelect.value==="medium") return {speed:600,timer:4000,multiplier:1.5};
    return {speed:450,timer:3000,multiplier:2};
}

function startGame(){
    sequence=[]; level=0; score=0; playing=true; message.textContent="";
    levelDisplay.textContent=level;
    scoreDisplay.textContent=score;
    progressBar.style.width="0%";
    nextRound();
}

function nextRound(){
    playerIndex=0; level++;
    levelDisplay.textContent=level;
    progressBar.style.width=(level/maxLevel)*100+"%";

    if(level>maxLevel){
        message.textContent="🎉 Mission Complete!";
        updateHighScore();
        playing=false;
        return;
    }

    sequence.push(Math.floor(Math.random()*6));
    playSequence();
}

function playSequence(){
    const settings=getSettings();
    disablePlanets();
    sequence.forEach((num,i)=>{
        setTimeout(()=>flash(planets[num]), settings.speed*(i+1));
    });
    setTimeout(enablePlanets, settings.speed*sequence.length+300);
}

function flash(button){
    button.classList.add("active");
    setTimeout(()=>button.classList.remove("active"),500);
}

function disablePlanets(){ planets.forEach(p=>p.disabled=true);}
function enablePlanets(){ planets.forEach(p=>p.disabled=false); startTimer(); }

function startTimer(){
    const settings=getSettings();
    let timeLeft=settings.timer;
    timerBar.style.width="100%";
    clearInterval(timer);
    timer=setInterval(()=>{
        timeLeft-=50;
        timerBar.style.width=(timeLeft/settings.timer)*100+"%";
        if(timeLeft<=0){ clearInterval(timer); gameOver(); }
    },50);
}

function checkAnswer(index){
    if(!playing) return;
    if(index!==sequence[playerIndex]){ gameOver(); return; }
    playerIndex++;
    if(playerIndex===sequence.length){ clearInterval(timer); updateScore(); setTimeout(nextRound,800);}
}

function updateScore(){
    const settings=getSettings();
    score+=level*settings.multiplier;
    scoreDisplay.textContent=Math.floor(score);
}

function gameOver(){
    playing=false;
    clearInterval(timer);
    message.textContent="❌ Mission Failed!";
    updateHighScore();
}

function updateHighScore(){
    if(score>highScore){
        highScore=score;
        localStorage.setItem("highScore",highScore);
        highScoreDisplay.textContent=highScore;
    }
}

planets.forEach((planet)=>planet.addEventListener("click",()=>checkAnswer(Number(planet.getAttribute("data-id")))));
startBtn.addEventListener("click",startGame);
