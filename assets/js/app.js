// Instructions
// Make sure that your app suits this basic spec:
// When adding trains, administrators should be able to submit the following:
// Train Name
// Destination
// First Train Time -- in military time
// Frequency -- in minutes
// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.
// Styling and theme are completely up to you. Get Creative!

// Bonus (Extra Challenges)
// Consider updating your "minutes to arrival" and "next train time" text once every minute. This is significantly more challenging; only attempt this if you've completed the actual activity and committed it somewhere on GitHub for safekeeping (and maybe create a second GitHub repo).
// Try adding update and remove buttons for each train. Let the user edit the row's elements-- allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).
// As a final challenge, make it so that only users who log into the site with their Google or GitHub accounts can use your site. You'll need to read up on Firebase authentication for this bonus exercise.


//Initialize Firebase Database
var config = {
    apiKey: "AIzaSyBjJ_oHsxoGsPS7Nv1YJzdSZQ9s99QTIAc",
    authDomain: "rpsmp-7bc44.firebaseapp.com",
    databaseURL: "https://rpsmp-7bc44.firebaseio.com",
    projectId: "rpsmp-7bc44",
    storageBucket: "rpsmp-7bc44.appspot.com",
    messagingSenderId: "106300897679"
};
firebase.initializeApp(config);
//Create database references
var database = firebase.database();
var trainsRef = database.ref('trains');
var trainRow = 0;
var isAdding = false;
var trainClockTickers = [];
$(document).ready(function(){

    database.ref('trains').on('child_added', function (snap) {

        if (snap) {
            var tr = createRow(snap.val())
        
            $('#tableBody').append(tr)
        }

    })

    $('#addit').click(function (event) {
        $('#validation').hide()
        $('#addit').prop('disabled',true)
        if(!isAdding){
            isAdding = true;
            var trainData = makeTrainObject()
            if(trainData !== false){
                database.ref('trains').push(trainData)
            }
            
            isAdding = false;
        } 
        $('#addit').prop('disabled', false)
        return
    })

    $('#trainArriveH').focusout(digithelper)
    $('#trainArriveM').focusout(digithelper)
    $('#frenquency').focusout(digithelper,true)
   

})
function digithelper(event, l = false) {
    var f = event.target.value
    if (!l){ 
    if (parseInt(f) < 10 && parseInt(f) > -1) {
        f = "0" + f
        event.target.value = f
    } else if (parseInt(f) == -1) {
        event.target.value = "00"
    } else {
        event.target.value = f
    }
    } else {
        if (f < 10) {
             event.target.value = f
        }
    }

}

function nextTrain(_firstTrain, _frequency) {
    if (hasFirstTrainArrived(_firstTrain)) {
    
    }
}

function makeTrainObject(){
 
   var trainob = {
    trainName: $('#trainName').val(),
    destination: $('#destination').val(),
    trainArriveH: $('#trainArriveH').val(),
    trainArriveM: $('#trainArriveM').val(),
    frequency: $('#frequency').val(),
    has1stTrainArrived: false
    }
    
    if(validateForm(trainob)){
        clearForm()
        return trainob
    }   
    return false
}
function validateForm(_trainob){
    var error = []
    if (_trainob.trainName.length < 1) {
        error.push('Train Name is missing.')
    }
    if (_trainob.destination.length < 1) {
        error.push('Train destination is missing.')
    }

    var isValid = moment(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "HH:mm").isValid()
    if (!isValid) {
        error.push('Train Arrival Time is Invalid.')
    }
    var isValidFre = (parseInt(_trainob.frequency) > 0) && (parseInt(_trainob.frequency) < 1440)
    if (!isValidFre) {
        error.push('Train Frequency is Invalid. Must be greater than 0 and less than 1,440 minutes.')
        

    }
    if (error.length > 0) {
        errors(error)
        return false
    }
    return true

}
function errors(_error) {
    
    $('#validation').empty()
    _error.forEach(element => {
    $('#validation').append($('<div>').text(element))
    });
    $('#validation').show()


}
function clearForm(){
    $('#trainName').val('')
    $('#destination').val('')
    $('#trainArriveH').val('')
    $('#trainArriveM').val('')
    $('#frequency').val('')
}
function createRow(_trainob) {
   
    
    var cellName = $('<td>')
    cellName.text(_trainob.trainName)
    
    var cellDest = $('<td>')
    cellDest.text(_trainob.destination)
    
    var cellFirst = $('<td>')
    if (!_trainob.trainArriveM.length) {
        _trainob.trainArriveM = "00"
    }
    if (!_trainob.trainArriveH.length) {
        _trainob.trainArriveH = "00"
    }
    var timeFirst = moment().format(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "HH:mm")
    cellFirst.text(timeFirst)
    var firstTrainCame = moment().isSameOrAfter(moment(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "HH:mm")) 
    var cellFrequency = $('<td>')
    cellFrequency.text(_trainob.frequency)
    var frequency = parseFloat(_trainob.frequency * 60) // in seconds
    console.log("Train comes every " + frequency + " seconds")
    var cellNextTrain = $('<td>')
    var trid ='train_' + trainRow
    cellNextTrain.attr('id', trid)
    var ntrainTime;
    if (firstTrainCame) {
        var d = new moment() // time now
        console.log("now: " + d.format('HH:mm'))
        var c = new moment(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "HH:mm")
        console.log("time of first train " + c.format('HH:mm'))
        var timePastSinceFirstTrain = moment.duration(d.diff(c))
        console.log("Seconds past since first train " + timePastSinceFirstTrain.asSeconds())
        var numberOfTimesTrainHasCome = (timePastSinceFirstTrain.asSeconds() / frequency)
        console.log("Time Train Has Came " + numberOfTimesTrainHasCome)
        var remainder = (timePastSinceFirstTrain.asSeconds() % frequency)
        console.log("Remainder " + remainder)
        var remainderasDuration = moment.duration(remainder, 'seconds')
        var secondsToWait = moment(d).add(remainderasDuration)
        console.log("Minutes to wait " + secondsToWait)
        console.log("Minutes since last train has left = " + moment.duration(remainder, 'seconds').asMinutes())
        ntrainTime = moment.duration((frequency - remainder), 'seconds').humanize()
        console.log("Time to wait" + ntrainTime)
      
    }else{
        //how many minutes to the first trian arival time | arivalTime - nowTime 
        var d = new moment()
        var c = new moment(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "HH:mm")
        var dur = moment.duration(c.diff(d))
        ntrainTime = dur.humanize()
    }
    
    
    cellNextTrain.text(ntrainTime)
    var row = $('<tr>')
    row.append(cellName)
        .append(cellDest)
        .append(cellFirst)
        .append(cellFrequency)
        .append(cellNextTrain);
    trainRow++
    return row

}

function getTimeofNextTrain(_hh,_mm) {
    var time = hhmmTimeToMoment(_hh,_mm)
    return getTimeDiffInMinutes(time)
}
function hhmmTimeToMoment(_hh,_mm) {
    return moment().format(_hh + ":" + _mm, "HH:mm");
}
function getTimeDiffInMinutes(_moment) {
    return moment().diff(moment(_moment), 'minutes', true)
}


