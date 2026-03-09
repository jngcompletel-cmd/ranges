

const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
let gridHands=[], currentHand, currentSpot="BTN_open_25bb";
let ranges={}, errors={}, total=0, correct=0;
let sessionHands=[], currentIndex=0, sessionSize=20;
let retryHands=[];

// Générer toutes les mains
function generateHands(){
  gridHands=[];
  for(let i=0;i<13;i++){
    for(let j=0;j<13;j++){
      let hand = (i===j) ? ranks[i]+ranks[j] : (i<j) ? ranks[i]+ranks[j]+"s" : ranks[j]+ranks[i]+"o";
      gridHands.push(hand);
    }
  }
}

// Changer de spot
function changeSpot(){
  currentSpot=document.getElementById("spotSelector").value;
  if(!ranges[currentSpot]) ranges[currentSpot]={raise:[],shove:[],call:[],fold:[],var:[]};
  startQuiz();
}

// Commencer une session quiz
function startQuiz(){
  total=0; correct=0; retryHands=[];
  sessionHands=[];
  currentIndex=0;
  // tirer 20 mains aléatoires
  for(let i=0;i<sessionSize;i++){
    sessionHands.push(gridHands[Math.floor(Math.random()*gridHands.length)]);
  }
  showHand();
  updateStats();
  document.getElementById("restartBtn").style.display="none";
}

// Afficher la main actuelle
function showHand(){
  if(currentIndex>=sessionHands.length){
    showResults();
    return;
  }
  currentHand=sessionHands[currentIndex];
  document.getElementById("hand").innerText=currentHand;
}

// Obtenir action correcte
function getCorrectAction(){
  let spot=ranges[currentSpot];
  if(!spot) return "fold";
  if(spot.raise.includes(currentHand)) return "raise";
  if(spot.shove.includes(currentHand)) return "shove";
  if(spot.call.includes(currentHand)) return "call";
  if(spot.var.includes(currentHand)) return "var";
  return "fold";
}

// Répondre
function answer(action){
  let correctAction=getCorrectAction();
  total++;
  if(action===correctAction){
    correct++;
  } else {
    retryHands.push(currentHand); // ajouter pour rejouer
  }
  currentIndex++;
  updateStats();
  showHand();
}

// Mettre à jour stats
function updateStats(){
  document.getElementById("total").innerText=total;
  document.getElementById("correct").innerText=correct;
  document.getElementById("accuracy").innerText=((correct/total)*100).toFixed(1);
}

// Afficher les résultats finaux
function showResults(){
  document.getElementById("hand").innerText="Quiz terminé !";
  alert(`Quiz terminé !\nCorrect : ${correct} / ${total}\nAccuracy : ${((correct/total)*100).toFixed(1)}%`);
  if(retryHands.length>0){
    document.getElementById("restartBtn").style.display="inline-block";
  }
}

// Rejouer les mains incorrectes
function restartQuiz(){
  sessionHands=retryHands.slice();
  retryHands=[];
  currentIndex=0;
  total=0; correct=0;
  updateStats();
  showHand();
  document.getElementById("restartBtn").style.display="none";
}

// Initialisation
generateHands();
changeSpot();
