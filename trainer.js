et ranges={}

let currentSpot=null

let sessionHands=[]
let errorHands=[]

let currentIndex=0
let score=0



document.getElementById("jsonFile").addEventListener("change",loadJSON)



function loadJSON(event){

let file=event.target.files[0]

let reader=new FileReader()

reader.onload=function(e){

ranges=JSON.parse(e.target.result)

populateSpots()

alert("Ranges loaded")

}

reader.readAsText(file)

}



function populateSpots(){

let selector=document.getElementById("spotSelector")

selector.innerHTML=""

let spots=Object.keys(ranges)

spots.forEach((spot,i)=>{

let option=document.createElement("option")

option.value=spot
option.textContent=spot

selector.appendChild(option)

})

currentSpot=spots[0]

}



function startQuiz(){

currentSpot=document.getElementById("spotSelector").value

let spot=ranges[currentSpot]

let allHands=[]

let actions=["raise","shove","call","fold","var"]

actions.forEach(action=>{

if(spot[action]){

spot[action].forEach(hand=>{

allHands.push(hand)

})

}

})

let count=parseInt(document.getElementById("questionCount").value)

sessionHands=shuffle(allHands).slice(0,count)

errorHands=[]

currentIndex=0
score=0

showHand()

}



function showHand(){

if(currentIndex>=sessionHands.length){

showResult()
return

}

document.getElementById("hand").innerText=sessionHands[currentIndex]

document.getElementById("result").innerText=""

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



function answer(action){

let hand=sessionHands[currentIndex]

let correct=getCorrectAction(hand)

if(action===correct){

score++

}else{

errorHands.push(hand)

}

currentIndex++

showHand()

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

showHand()

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