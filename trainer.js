const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"]

let gridHands=[]
let ranges={}
let errorsMemory={}

let currentSpot=null
let mode="normal"
let sessionSize=20

let sessionHands=[]
let retryHands=[]

let currentHand
let index=0
let total=0
let correct=0


function generateHands(){

for(let i=0;i<13;i++){

for(let j=0;j<13;j++){

let hand

if(i===j) hand=ranks[i]+ranks[j]

else if(i<j) hand=ranks[i]+ranks[j]+"s"

else hand=ranks[j]+ranks[i]+"o"

gridHands.push(hand)

}

}

}


function loadJSON(event){

const file=event.target.files[0]

if(!file) return

const reader=new FileReader()

reader.onload=function(e){

ranges=JSON.parse(e.target.result)

populateSpots()

alert("Range chargée")

startQuiz()

}

reader.readAsText(file)

}


function populateSpots(){

const selector=document.getElementById("spotSelector")

selector.innerHTML=""

const spots=Object.keys(ranges)

spots.forEach((spot,i)=>{

const option=document.createElement("option")

option.value=spot
option.textContent=spot

selector.appendChild(option)

if(i===0){
currentSpot=spot
}

})

}


function changeSpot(){

currentSpot=document.getElementById("spotSelector").value

startQuiz()

}


function changeMode(){

mode=document.getElementById("modeSelector").value

startQuiz()

}


function changeSize(){

sessionSize=parseInt(document.getElementById("sizeSelector").value)

startQuiz()

}


function getRangeHands(){

let spot=ranges[currentSpot]

if(!spot) return []

let all=[]

if(spot.raise) all=all.concat(spot.raise)
if(spot.shove) all=all.concat(spot.shove)
if(spot.call) all=all.concat(spot.call)
if(spot.var) all=all.concat(spot.var)

return [...new Set(all)]

}


function getBorderHands(){

let range=getRangeHands()

let borders=[]

for(let hand of range){

if(hand.length==2) continue

let r1=hand[0]
let r2=hand[1]
let type=hand[2]

let i1=ranks.indexOf(r1)
let i2=ranks.indexOf(r2)

if(i1+1<ranks.length){

let newHand=ranks[i1+1]+r2+type

borders.push(normalize(newHand))

}

if(i2+1<ranks.length){

let newHand=r1+ranks[i2+1]+type

borders.push(normalize(newHand))

}

}

borders=borders.filter(h=>gridHands.includes(h))

return [...new Set(borders)]

}


function buildPool(){

let pool=[]

if(mode==="range") pool=getRangeHands()

else if(mode==="border") pool=getBorderHands()

else pool=[...gridHands]

let spot=ranges[currentSpot]

if(spot && spot.ignore){

pool=pool.filter(hand=>!spot.ignore.includes(hand))

}

return pool

}


function addErrorWeight(pool){

let weighted=[...pool]

for(let hand of pool){

if(errorsMemory[hand]){

for(let i=0;i<errorsMemory[hand];i++){

weighted.push(hand)

}

}

}

return weighted

}


function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))

[array[i],array[j]]=[array[j],array[i]]

}

}


function startQuiz(){

total=0
correct=0
index=0
retryHands=[]

let pool=buildPool()

pool=addErrorWeight(pool)

shuffle(pool)

if(ranges[currentSpot] && ranges[currentSpot].ignore){

pool=pool.filter(hand=>!ranges[currentSpot].ignore.includes(hand))

}

let unique=[]

for(let hand of pool){

if(!unique.includes(hand)) unique.push(hand)

if(unique.length===sessionSize) break

}

sessionHands=unique

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
let t=hand[2]

if(order.indexOf(r1)<order.indexOf(r2)) return r1+r2+t

return r2+r1+t

}


function getCorrectAction(){

let spot=ranges[currentSpot]

if(!spot) return "fold"

if(spot.ignore && spot.ignore.includes(currentHand)) return null

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

if(good===null){

index++

nextHand()

return

}

total++

if(action===good){

correct++

}

else{

retryHands.push(currentHand)

errorsMemory[currentHand]=(errorsMemory[currentHand]||0)+1

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

document.getElementById("hand").innerText="Session terminée"

alert("Score : "+correct+" / "+total)

if(retryHands.length>0)

document.getElementById("retryBtn").style.display="inline"

}


function retryErrors(){

sessionHands=[...new Set(retryHands)]

retryHands=[]

index=0

total=0

correct=0

updateStats()

nextHand()

}


generateHands()