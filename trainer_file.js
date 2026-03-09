

const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"]
let gridHands=[]
let mode="raise"
let currentHand
let ranges={}
let currentSpot="BTN_open_25bb"

// Stats
let total=0
let correct=0
let errors={}
let frontieres=false

// Générer toutes les mains
function generateHands(){
  gridHands=[]
  for(let i=0;i<13;i++){
    for(let j=0;j<13;j++){
      let hand
      if(i===j){ hand=ranks[i]+ranks[j] }
      else if(i<j){ hand=ranks[i]+ranks[j]+"s" }
      else{ hand=ranks[j]+ranks[i]+"o" }
      gridHands.push(hand)
    }
  }
}

// Changer de spot
function changeSpot(){
  currentSpot=document.getElementById("spotSelector").value
  if(!ranges[currentSpot]) ranges[currentSpot]={raise:[],shove:[],call:[],fold:[],var:[]}
  nextHand()
}

// Mode frontières
function toggleFrontieres(){
  frontieres=!frontieres
  alert("Mode frontières "+(frontieres?"activé":"désactivé"))
}

// Choisir main aléatoire
function nextHand(){
  if(frontieres && Object.keys(errors).length>0){
    let weighted=[]
    gridHands.forEach(h=>{
      let count=errors[h]?.count||0
      for(let i=0;i<1+count;i++) weighted.push(h)
    })
    currentHand=weighted[Math.floor(Math.random()*weighted.length)]
  } else {
    currentHand=gridHands[Math.floor(Math.random()*gridHands.length)]
  }
  document.getElementById("hand").innerText=currentHand
}

// Obtenir action correcte
function getCorrectAction(){
  let spot=ranges[currentSpot]
  if(!spot) return "fold"
  if(spot.raise.includes(currentHand)) return "raise"
  if(spot.shove.includes(currentHand)) return "shove"
  if(spot.call.includes(currentHand)) return "call"
  if(spot.var.includes(currentHand)) return "var"
  return "fold"
}

// Répondre
function answer(action){
  let correctAction=getCorrectAction()
  total++
  if(action===correctAction){
    correct++
    if(errors[currentHand]) errors[currentHand].count--
    if(errors[currentHand]?.count<=0) delete errors[currentHand]
  } else {
    if(!errors[currentHand]) errors[currentHand]={expected:correctAction, chosen:action, count:0}
    errors[currentHand].count++
  }
  updateStats()
  nextHand()
}

// Stats
function updateStats(){
  document.getElementById("total").innerText=total
  document.getElementById("correct").innerText=correct
  document.getElementById("accuracy").innerText=((correct/total)*100).toFixed(1)
}

// Export JSON
function exportData(){
  let data={ranges,stats:{total,correct,accuracy:((correct/total)*100).toFixed(1)},errors}
  let blob=new Blob([JSON.stringify(data,null,2)], {type:"application/json"})
  let url=URL.createObjectURL(blob)
  let a=document.createElement("a")
  a.href=url
  a.download="trainer_export.json"
  a.click()
  URL.revokeObjectURL(url)
}

// Importer depuis fichier JSON
function importFile(){
  const fileInput=document.getElementById("jsonFile")
  if(fileInput.files.length===0){
    alert("Veuillez sélectionner un fichier JSON")
    return
  }
  const file=fileInput.files[0]
  const reader=new FileReader()
  reader.onload=function(e){
    try{
      const data=JSON.parse(e.target.result)
      if(!data.ranges) throw new Error("Le JSON doit contenir la clé 'ranges'")
      ranges=data.ranges
      errors=data.errors || {}
      if(data.stats){
        total=data.stats.total||0
        correct=data.stats.correct||0
      } else { total=0; correct=0 }
      updateStats()
      nextHand()
      alert("Import réussi !")
    } catch(err){
      alert("Erreur JSON : "+err.message)
    }
  }
  reader.readAsText(file)
}

// Initialisation
generateHands()
changeSpot()

