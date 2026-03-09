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

function normalize(hand){

const order="AKQJT98765432"

if(hand.length==2) return hand

let r1=hand[0]
let r2=hand[1]
let type=hand[2]

if(order.indexOf(r1) < order.indexOf(r2)){

return r1+r2+type

}else{

return r2+r1+type

}

}

function getCorrectAction(){

let spot=ranges[currentSpot]

if(!spot) return "fold"

let hand=normalize(currentHand)

function check(list){

if(!list) return false

return list.map(h=>normalize(h.trim())).includes(hand)

}

if(check(spot.raise)) return "raise"
if(check(spot.shove)) return "shove"
if(check(spot.call)) return "call"
if(check(spot.var)) return "var"

return "fold"

}

function answer(action){

let good=getCorrectAction()

total++

if(action===good){

correct++

}else{

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