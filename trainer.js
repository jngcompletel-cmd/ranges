

const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"]

let gridHands=[]
let ranges={}
let currentSpot="BTN_open_25bb"

let sessionHands=[]
let retryHands=[]

let currentHand
let index=0
let total=0
let correct=0

const sessionSize=20

function generateHands(){

for(let i=0;i<13;i++){

for(let j=0;j<13;j++){

let hand

if(i===j){

hand=ranks[i]+ranks[j]

}

else if(i<j){

hand=ranks[i]+ranks[j]+"s"

}

else{

hand=ranks[j]+ranks[i]+"o"

}

gridHands.push(hand)

}

}

}

function loadJSON(event){

const file=event.target.files[0]

if(!file)return

const reader=new FileReader()

reader.onload=function(e){

try{

ranges=JSON.parse(e.target.result)

alert("Range chargée")

startQuiz()

}

catch{

alert("Erreur dans le JSON")

}

}

reader.readAsText(file)

}

function changeSpot(){

currentSpot=document.getElementById("spotSelector").value

startQuiz()

}

function startQuiz(){

total=0
correct=0
index=0
retryHands=[]

sessionHands=[]

for(let i=0;i<sessionSize;i++){

sessionHands.push(
gridHands[Math.floor(Math.random()*gridHands.length)]
)

}

nextHand()

updateStats()

document.getElementById("retryBtn").style.display="none"

}

function nextHand(){

if(index>=sessionHands.length){

endQuiz()
return

}

currentHand=sessionHands[index]

document.getElementById("hand").innerText=currentHand

}

function getCorrectAction(){

let spot=ranges[currentSpot]

if(!spot)return "fold"

if(spot.raise && spot.raise.includes(currentHand))return"raise"

if(spot.shove && spot.shove.includes(currentHand))return"shove"

if(spot.call && spot.call.includes(currentHand))return"call"

if(spot.var && spot.var.includes(currentHand))return"var"

return"fold"

}

function answer(action){

let good=getCorrectAction()

total++

if(action===good){

correct++

}

else{

retryHands.push(currentHand)

}

index++

updateStats()

nextHand()

}

function updateStats(){

document.getElementById("total").innerText=total
document.getElementById("correct").innerText=correct

let acc=total?((correct/total)*100).toFixed(1):0

document.getElementById("accuracy").innerText=acc

}

function endQuiz(){

document.getElementById("hand").innerText="Quiz terminé"

alert(
"Score : "+correct+" / "+total+
"\nAccuracy : "+((correct/total)*100).toFixed(1)+"%"
)

if(retryHands.length>0){

document.getElementById("retryBtn").style.display="inline"

}

}

function retryErrors(){

sessionHands=[...retryHands]

retryHands=[]

index=0
total=0
correct=0

updateStats()

nextHand()

}

generateHands()