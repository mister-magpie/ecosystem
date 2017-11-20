var species = [
    "fishing","oil","agricolture","recreation","shipping","nutrients","waterQuality","aquaculture","birds","invertebrates","wildMussels","tourism","economy"
]


// who interacts with whom
var interactionGrid = [
    [0,0,0,1,0,0,1,1,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,0,0,1],
    [0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,0,1,0],
    [1,1,0,1,0,0,1,1,1,0,0,1,1],
    [0,0,0,0,0,0,1,1,0,1,1,0,0],
    [1,0,0,1,0,0,0,1,1,1,1,1,0],
    [1,1,0,1,0,1,0,0,0,1,1,0,1],
    [0,0,0,1,0,1,1,0,0,1,1,0,0],
    [1,0,0,0,0,1,1,0,1,0,1,0,0],
    [1,0,0,0,0,0,0,0,1,0,0,0,0],
    [1,1,1,0,1,0,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0]
];
//probabilities of interacion and their reciprocate
var interactionProb = [
    [0,0,0,0.4,0,0,0.4,0.4,0.3,0.2,0.2,0,0.75],
    [0.3,0,0.3,0.4,0.4,0,0.3,0.3,0.4,0.4,0,0,0.8],
    [0,0,0,0,0,0.9,0.15,0,0,0,0,0,0.8],
    [0.4,0.45,0.4,0,0.6,0.7,0.35,0.35,0.3,0.4,0,0.9,0],
    [0.3,0.45,0,0.35,0,0,0.35,0.35,0.3,0,0,0.6,0.8],
    [0,0,0,0,0,0,0.1,0.25,0,0.25,0.25,0,0],
    [0.7,0,0,0.8,0,0,0,0.8,0.8,0.8,0.9,0.7,0],
    [0.3,0.45,0,0.4,0,0.8,0,0,0,0.4,0.3,0,0.8],
    [0,0,0,0.9,0,0.4,0.35,0,0,0.3,0.3,0,0],
    [0.6,0,0,0,0,0.4,0.65,0,0.9,0,0.4,0,0],
    [0,0,0,0,0,0,0,0,0.8,0,0,0,0],
    [0.3,0.3,0.3,0,0.3,0,0,0.3,0,0,0,0,0.9]
];

var recipProbs2 = [
    [1,1,1,0.6,1,1,0.6,0.6,0.7,0.8,0.8,1,0.25],
    [0.7,1,0.7,0.6,0.6,1,0.7,0.7,0.6,0.6,1,1,0.2],
    [1,1,1,1,1,0.1,0.85,1,1,1,1,1,0.2],
    [0.6,0.55,0.6,1,0.4,0.3,0.65,0.65,0.7,0.6,1,0.1,1],
    [0.7,0.55,1,0.65,1,1,0.65,0.65,0.7,1,1,0.4,0.2],
    [1,1,1,1,1,1,0.9,0.75,1,0.75,0.75,1,1],
    [0.3,1,1,0.2,1,1,1,0.2,0.2,0.2,0.1,0.3,1],
    [0.7,0.55,1,0.6,1,0.2,1,1,1,0.6,0.7,1,0.2],
    [1,1,1,0.1,1,0.6,0.65,1,1,0.7,0.7,1,1],
    [0.4,1,1,1,1,0.6,0.35,1,0.1,1,0.6,1,1],
    [1,1,1,1,1,1,1,1,0.2,1,1,1,1],
    [0.7,0.7,0.7,1,0.7,1,1,0.7,1,1,1,1,0.1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// map of predators for each species
var predators = new Map();
for(var col = 0; col < species.length; col++){
    var pred = [];
    for (var row = 0; row < species.length; row++) {
        if(interactionGrid[row][col] == 1){
            pred.push(species[row])
        }
    predators.set(species[col],pred)
    }
}


var priorOfIncreasing = new Map()
var posteriorOfIncreasing = new Map()

species.forEach(function(el,idx){
    priorOfIncreasing.set(el,0.5)
    posteriorOfIncreasing.set(el,null)
})



function stop(){
    noise.stop();
    stopOsc(oscillators);
    clearInterval(timer);
}
var noise;
var oscillators
var timer;
function run(numberOfIterations){
    var iteration = 0;
    noise = new Tone.Noise("pink").toMaster();
    var drum = new Tone.MembraneSynth().toMaster();
    drum.volume.value = -12;
    oscillators = initOsc(12);
    noise.volume.value = -50;
    noise.fadeIn = 1;
    noise.start();

    timer = setInterval(function(){
        let quit = false;
        iteration++;
        if(numberOfIterations != -1 & iteration>=numberOfIterations) quit = true;
        if(quit){
            noise.stop();
            stopOsc(oscillators);
            clearInterval(timer);
        }
        console.log("iteration #"+iteration);
        drum.triggerAttackRelease(60);
        updateModel();
        updateOsc(oscillators)
    }, 500);
    // should iterate until nothing changes but we will run it indefinitely
    // for(var i = 0; i<numberOfIterations; i++){
    //     console.log("iteration #" + i);
}

function updateModel(){
    // play drum
    // for every node in the network
    for (var x = 0; x < species.length; x++) {
        let el = species[x]
        //console.log("calculating " + el);
        // get prior of el increasing
        setPriorsFromSliders();
        var prior = priorOfIncreasing.get(el);
        var post = posteriorOfIncreasing.get(el);
        if(post != null){
            //console.log("setting prior to post for " +  el);
            prior = post;
            updatePriors(x,post);
        }

        // get prior of predator increasing
        let pred = predators.get(el) // array of predators
        let predIncrease = [] //prior of each interacting species
        for (var y = 0; y < pred.length; y++) {
            predIncrease[y] = priorOfIncreasing.get(pred[y]);
        }
        //console.log(predIncrease);

        // BAYES FORMULA
        var postSpIncrease = new Array();
        var probSpIncrease_if_spYIncrease;
        var probSpIncrease_if_spYDecrease;
        var NotSitOnFenceCount = 0; //number of priors != 0.5

        // for each interacting species
        for (var y = 0; y < pred.length; y++) {
            //species =  x
            let predIndex = species.indexOf(pred[y])
            //console.log("bayes formula for: " + el +"("+x+")" + " and " + pred[y] + " ("+predIndex+")");

            probSpIncrease_if_spYIncrease = interactionProb[predIndex][x];
            //console.log(probSpIncrease_if_spYIncrease);
            probSpIncrease_if_spYDecreases = recipProbs2[predIndex][x];

            // apply the bayes formula!
            if(predIncrease[y] !== 0.5){
                //console.log("bayesing!")
                NotSitOnFenceCount = NotSitOnFenceCount + 1;
                // inside postSpIncrease there are only those who change, index given by NotSitOnFenceCount
                postSpIncrease[NotSitOnFenceCount - 1] = (probSpIncrease_if_spYIncrease * predIncrease[y]) + (probSpIncrease_if_spYDecreases * (1 - predIncrease[y]))

                //console.log("("+ probSpIncrease_if_spYIncrease +"*"+ predIncrease[y] +") + ("+ probSpIncrease_if_spYDecreases +"* ( 1 -" + predIncrease[y]+")");
            }
        }

        //console.log(postSpIncrease)
        var totalBayes1 = 0;
        var totalBayes2 = 0;
        //console.log(NotSitOnFenceCount);

        for(y = 0; y<NotSitOnFenceCount; y++){
            //console.log("totalbayes loop #"+y+" -> " + postSpIncrease[y]);
            totalBayes1 = totalBayes1 + (prior * (postSpIncrease[y] - 0.5));
            totalBayes2 = totalBayes2 + postSpIncrease[y];
        }
        //console.log("totalBayes: " + totalBayes1 + " - "+totalBayes2);
        var interim1;
        var interim2;

        if(NotSitOnFenceCount > 0){// to avoid division by 0
            interim1 = prior + (Math.abs(1 - prior)*(totalBayes1/NotSitOnFenceCount));
            interim2 = totalBayes2 / NotSitOnFenceCount;

            post = interim1;
            //console.log("interim1: " + interim1);
            if(prior == 0.5){
                //console.log("interim2: " + interim2)
                post = interim2;
            }
            if(prior < 0.5 & interim2 < interim1) post = interim2;
            if(prior > 0.5 & interim2 > interim1) post = interim2;
        }else{
            //console.log("post = prior for " + el);
            post = prior
        }
        /*
        // THIS SHOULD BE USELESS AS THERE IS NOTHING ON ROW 6
        If prior >= 0.5 And post < prior And Worksheets("Levels").Cells(6, x + 1) = 1 Then
            post = prior
        End If

        If prior < 0.5 And post > prior And Worksheets("Levels").Cells(6, x + 1) = 1 Then
            post = prior
        End If
        */

        //console.log("setting post to " +  post + " for " + el);
        updatePosteriors(species.indexOf(el), post);
        posteriorOfIncreasing.set(el,post)
    }
    console.log(posteriorOfIncreasing.values());
}


function updatePriors(idx, value){
    priorOfIncreasing.set(species[idx], value);
    //document.getElementById("priors-row").childNodes[idx].innerHTML = value.toFixed(2);
    //document.getElementById(species[idx]+"-slider").value = value*100;//.toFixed(2)*100;
}

function updatePosteriors(idx, value){
    posteriorOfIncreasing.set(species[idx], value);
    //document.getElementById("post-row").childNodes[idx].innerHTML = value.toFixed(2);
    document.getElementById(species[idx]+"-slider").value = value*100;//.toFixed(2)*100;
}

function setPriorsFromSliders(){
    species.forEach(function(el,idx){
        let value = document.getElementById(el+"-slider").value;
        priorOfIncreasing.set(el,parseInt(value)/100);
    })
}

function drawSliders(){
    species.forEach(function(el,idx){
        let div = document.getElementById('slider-container');
        div.innerHTML += '<span>'+el+': </span>' +
        '<input type="range" min="1" max="100" value="50" class="slider" id="'+el+'-slider'+'">';
    });

}

function drawTable() {
    var div = document.getElementById("graph")

    var table = document.createElement("TABLE");
    document.getElementById("graph").appendChild(table)

    var headingsRow = table.insertRow(0);
    headingsRow.setAttribute("id","headings-row");

    var priorsRow = table.insertRow(1);
    priorsRow.setAttribute("id","priors-row");

    var spacer = table.insertRow(2);
    spacer = spacer.insertCell();
    spacer.colSpan = 13;

    var postRow = table.insertRow(3);
    postRow.setAttribute("id","post-row")

    species.forEach(function(el,idx){
        //let r = document.getElementById("headings-row");
        //headingsRow.innerHTML += "<th>"+el+"</th>"
        var c = headingsRow.insertCell(idx);
        c.innerHTML = el;
    })
    priorOfIncreasing.forEach(function(el,idx){
        //let r = document.getElementById("priors-row")
        priorsRow.innerHTML += "<td>"+el+"</td>"
    });
    posteriorOfIncreasing.forEach(function(el,idx){
        //let r = document.getElementById("priors-row")
        postRow.innerHTML += "<td>"+el+"</td>"
    });
}

function reset(){
    species.forEach(function(el,idx){
        priorOfIncreasing.set(el,0.5)
        document.getElementById("priors-row").childNodes[idx].innerHTML = 0.5;
        document.getElementById(species[idx]+"-slider").value = 50;
        posteriorOfIncreasing.set(el,null)
        document.getElementById("post-row").childNodes[idx].innerHTML = "null";
    });
}

function updateOsc(oscillators){
    oscillators.forEach(function(el,idx){
        let p = priorOfIncreasing.get(species[idx]);
        el.trem.frequency.value = p*10;
        el.osc.volume.value = (-100 + p*100)/2;
    })
}

function stopOsc(oscillators){
    oscillators.forEach(function(el,idx){
        el.osc.stop();
        el.trem.stop();
    })
}

function initOsc(number){
    var oscillators = [];
    for (var i = 1; i < number+1; i++) {
        let p = priorOfIncreasing.get(species[i]);
        oscillators[i-1] = new Object();
        oscillators[i-1].osc = new Tone.OmniOscillator(100*(i),"fmsine").start();
        oscillators[i-1].osc.volume.value = (-100 + p*100)/2;
        oscillators[i-1].osc.fadeIn = 1;
        oscillators[i-1].trem = new Tone.Tremolo(5, 1).toMaster().start();
        oscillators[i-1].osc.connect(oscillators[i-1].trem);
    }
    return oscillators;
}


function drawCircles(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  canvas.width = 800;
  var radius = 100;
  species.forEach(function(el,idx){
      var centerX = 20 + idx*25;
      var centerY = canvas.height/2;
      context.beginPath();
      context.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
      context.fillStyle = 'green';
      context.fill();
      //context.lineWidth = 1;
      //context.strokeStyle = '#003300';
      //context.stroke();
  })
}

var stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
