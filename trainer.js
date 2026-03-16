let ranges={}
let currentSpot=null

let sessionHands=[]
let errorHands=[]

let currentIndex=0
let score=0

let weights={}

document.getElementById("jsonFile").addEventListener("change",loadJSON)

function loadJSON(event){

let file=event.target.files[0]
if(!file)return

let reader=new FileReader()

reader.onload=function(e){

ranges=JSON.parse(e.target.result)

populateSpots()

loadWeights()

alert("Ranges loaded")

}

reader.readAsText(file)

}

function populateSpots(){

let selector=document.getElementById("spotSelector")

selector.innerHTML=""

let spots=Object.keys(ranges)

spots.forEach((spot)=>{

let option=document.createElement("option")

option.value=spot
option.textContent=spot

selector.appendChild(option)

})

currentSpot=spots[0]

}

function startQuiz(){

let selector=document.getElementById("spotSelector")

if(selector.value){
currentSpot=selector.value
}

let spot=ranges[currentSpot]

let actions=["raise","shove","call","fold","var"]

let allHands=[]

actions.forEach(action=>{

if(spot[action]){

spot[action].forEach(hand=>{
allHands.push(hand)
})

}

})

let mode=document.getElementById("mode").value

if(mode==="frontier"){
allHands=getFrontierHands(spot)
}

let count=parseInt(document.getElementById("questionCount").value)

sessionHands=weightedSelection(allHands,count)

currentIndex=0
score=0
errorHands=[]

updateCounter()
updateScore()
updateErrors()
updateProgress()

showHand()

}

function showHand(){

if(currentIndex>=sessionHands.length){

showResult()
return

}

updateCounter()
updateScore()
updateErrors()
updateProgress()

document.getElementById("hand").innerText=sessionHands[currentIndex]

document.getElementById("feedback").innerText=""

}

function answer(action){

let hand=sessionHands[currentIndex]

let correct=getCorrectAction(hand)

let feedback=document.getElementById("feedback")

if(action===correct){

score++
updateScore()

feedback.innerHTML="<span class='correct'>Correct</span>"

decreaseWeight(hand)

}else{

errorHands.push(hand)

updateErrors()

feedback.innerHTML="<span class='wrong'>Wrong (correct: "+correct+")</span>"

increaseWeight(hand)

}

saveWeights()

currentIndex++

setTimeout(showHand,600)

}

function showResult(){

let total=sessionHands.length

let percent=Math.round(score/total*100)

document.getElementById("hand").innerText="Finished"

document.getElementById("result").innerText=
"Score : "+score+" / "+total+" ("+percent+"%)"

}

function retryErrors(){

if(errorHands.length===0){

alert("No errors")
return

}

sessionHands=[...errorHands]

errorHands=[]

currentIndex=0
score=0

updateErrors()

showHand()

}

function getCorrectAction(hand){

let spot=ranges[currentSpot]

let actions=["raise","shove","call","fold","var"]

for(let action of actions){

if(spot[action] && spot[action].includes(hand)){
return action
}

}

return null

}

function updateCounter(){

let total=sessionHands.length
let current=currentIndex+1

if(current>total) current=total

document.getElementById("counter").innerText=current+"/"+total

}

function updateScore(){

document.getElementById("liveScore").innerText=score

}

function updateErrors(){

document.getElementById("liveErrors").innerText=errorHands.length

}

function updateProgress(){

let total=sessionHands.length

if(total===0)return

let percent=(currentIndex/total)*100

document.getElementById("progressBar").style.width=percent+"%"

}

function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))

let temp=array[i]

array[i]=array[j]
array[j]=temp

}

return array

}

function getFrontierHands(spot){

let frontier=[]

let actions=["raise","shove","call","fold","var"]

actions.forEach(action=>{

if(spot[action]){

spot[action].forEach(hand=>{

if(isFrontier(hand)){
frontier.push(hand)
}

})

}

})

return frontier

}

function isFrontier(hand){

let rankOrder="AKQJT98765432"

if(hand.length===2)return true

let r1=rankOrder.indexOf(hand[0])
let r2=rankOrder.indexOf(hand[1])

return Math.abs(r1-r2)<=2

}

function weightedSelection(hands,count){

let pool=[]

hands.forEach(hand=>{

let w=weights[hand]||1

for(let i=0;i<w;i++){
pool.push(hand)
}

})

pool=shuffle(pool)

let result=[]
let used=new Set()

for(let hand of pool){

if(!used.has(hand)){

result.push(hand)
used.add(hand)

}

if(result.length>=count)break

}

return result

}

function loadWeights(){

let saved=localStorage.getItem("rangeTrainerWeights")

if(saved){
weights=JSON.parse(saved)
}

}

function saveWeights(){

localStorage.setItem("rangeTrainerWeights",JSON.stringify(weights))

}

function increaseWeight(hand){

if(!weights[hand])weights[hand]=1

weights[hand]+=2

}

function decreaseWeight(hand){

if(!weights[hand])weights[hand]=1

weights[hand]=Math.max(1,weights[hand]-1)

}
