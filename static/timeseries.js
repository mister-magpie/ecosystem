var timedata;
var td_norm;
$(document).ready(function() {
   // Stuff to do as soon as the DOM is ready
   $.getJSON("./data_int.json",function(data){
       timedata = data.slice()
       console.log("data loaded");
       //$("#play-btn").prop("disabled", false);
   });
   $.getJSON("./data_int.json",function(data_int){
       td_norm = normalizedTimeseries(data_int.slice());
       //loadGraphs(td_norm)
       loadCanvas();
       checkboxes();
   })
   document.getElementById("play-btn").disabled = false;
});

function checkboxes(){
    var container = $("#checkboxes");
    for (var i = 0; i < timedata.length; i++) {
        $('<input />', { type: 'checkbox', id: 'chkbx-'+i, value: timedata[i].label , checked: true}).appendTo(container);
        $('<label />', { 'for': 'chkbx-'+i, text: timedata[i].label }).appendTo(container);
    }
}



var year = 0;
var drum = new Tone.MembraneSynth().toMaster();
    drum.oscillator.type = "sine";
    drum.volume.value = -12

var bell = new Tone.MetalSynth().toMaster();

var freeverb = new Tone.Freeverb(0.5,600);
Tone.Master.volume.value = -12;

//mute master until user presses play
//Tone.Master.mute = true;
Tone.Master.chain(freeverb);

var oscillators = createOsc();

Tone.Transport.scheduleRepeat(function(time){
    console.log("playing");
    //console.log(year++);// + " - year: " + (1890 + (year/0.126)));
    if (year == 1000) {
        stop();
    }
    drum.triggerAttackRelease("C4", "16n",Tone.now,0.2);

    oscillators.forEach(function(el,idx){
        if(el === null){
            return
        };
        el.osc.mute = false;
        if($("#chkbx-"+idx).prop("checked") & td_norm[idx].timeseries[year] != null){
            el.osc.mute = false;
            el.play(timedata,td_norm);
        }
        if(td_norm[idx].timeseries[year] === null){
            el.osc.mute = true;
        }
    });
}, "16n");

function play(startingFrom){
    year = startingFrom | 0;
    Tone.Master.mute = false;
    Tone.Transport.start();
}

function stop(){
    Tone.Transport.stop();
    Tone.Transport.clear();
    bell.triggerAttack();
    oscillators.forEach(function(el){
        if(el === null) return;
        el.osc.stop();
    })
    //Tone.Master.mute = true;
    year = 0;
}

function loadGraphs(d){
    plotData = []

    d.forEach(function(el,idx){
        let trace = {
            x: [...Array(timedata[0].timeseries.length).keys()], //spread operator, dirty hack :(
            y: el.timeseries,//normalize(el.timeseries),
            type: 'scatter',
            name: idx +" - "+ el.label
        };
        plotData[idx] = trace;
    })
    Plotly.newPlot('graphs', plotData);
}

function loadCanvas(){
    var can = document.getElementById("canvas");
    can.height = 520;
    can.width = 999;
    var ctx = can.getContext("2d");

    timedata.forEach(function(el,idx){
        //console.log("printing " + el.label);
        ctx.fillStyle = stringToColour(el.label);
        ctx.fillRect(0,40*idx,999,40);
    });
}

function normalizedTimeseries(tmdt){
    var res = tmdt.slice();
    res.forEach(function(el,idx){
        res[idx].timeseries = normalize(res[idx].timeseries);
    })
    return res;
}

function normalize(tms){
    let a = new Array(1000);
    let max = Math.max.apply(Math, tms);
    tms.forEach(function(el,idx) {
        if (el == null) {
            a[idx] = el;
        }else{
            a[idx] = el / max;
        }
    });
    return a;
}

function createOsc(){
    var oscillators = new Array(13);

    oscillators[0] = {
        osc: new Tone.OmniOscillator("C5","fmsquare").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[0].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = td_norm[0].timeseries[year]*880;
            }
        }
    }
    //
    oscillators[1] = {
        osc: new Tone.OmniOscillator("C2","fmsine").toMaster(),
        play: function(timedata, td_norm){
            if(this.osc.state == "stopped") this.osc.start();
            this.osc.modulationIndex.value = td_norm[1].timeseries[year]*10;
        }
    }

    oscillators[2] = {
        osc: new Tone.OmniOscillator("B3","fmsine").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[2].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.modulationIndex.value = td_norm[2].timeseries[year];
            }
        }
    }

    oscillators[3] = {
        osc: new Tone.OmniOscillator("F#5","fatsine").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[3].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.detune.value = timedata[3].timeseries[year];
              this.osc.spread = -40 + timedata[4].timeseries[year];
            }
        }
    }

    oscillators[4] = null;//oscillator[3]

    oscillators[5] = {
        osc:  new Tone.OmniOscillator("D5","fatsine").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[5].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = 880 + timedata[5].timeseries[year];
            }
        }
    }

    oscillators[6] = {
        osc:  new Tone.OmniOscillator("C2","fatsquare").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[6].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = timedata[6].timeseries[year];
            }
        }
    }

    oscillators[7] = {
        osc: new Tone.OmniOscillator("G2","fmsine").toMaster(),
        play: function(timedata, td_norm){
            if(this.osc.state == "stopped") this.osc.start();
            this.osc.modulationIndex.value = timedata[7].timeseries[year]*2;
        }
    }

    oscillators[8] = {
        osc:  new Tone.OmniOscillator("C2","fmsquare").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[8].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = timedata[8].timeseries[year];
            }
        }
    }

    oscillators[9] = {
        osc:  new Tone.OmniOscillator("G2","fmsquare").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[9].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = timedata[9].timeseries[year]/10;
            }
        }
    }

    oscillators[10] = {
        osc: new Tone.OmniOscillator("F5","fatsine").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[10].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = timedata[10].timeseries[year]/10;
            }
        }
    }

    oscillators[11] = {
        osc: new Tone.OmniOscillator("G2","fmsquare").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[11].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.frequency.value = timedata[11].timeseries[year]*30;
            }
        }
    }

    oscillators[12] = {
        osc: new Tone.OmniOscillator("G6","fatsine").toMaster(),
        play: function(timedata, td_norm){
            if(timedata[12].timeseries[year] != null){
              if(this.osc.state == "stopped") this.osc.start();
              this.osc.spread = timedata[12].timeseries[year];
            }
        }

    }

    oscillators.forEach(function(el){
        if(el === null) return;
        el.osc.volume.value = -12;
    });
    return oscillators
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
