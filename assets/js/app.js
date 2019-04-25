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

$(document).ready(function(){

    trainsRef.on('child_added',function(snap){



    })

    $('#addit').click(function(event){
        $('#addit').prop('disabled',true)
        if(!isAdding){
            isAdding = true;
            var trainData = makeTrainObject()
            if(trainData !== false){
                trainsRef.set(trainData)
            }
            $('#addit').prop('disabled',false)
        } 
        return
    })

})


function makeTrainObject(){
 
   var trainob = {
    trainName: $('#trainName').val(),
    destination: $('#destination').val(),
    trainArriveH: $('#trainArriveH').val(),
    trainArriveM: $('#trainArriveM').val(),
    frequency: $('#frequency').val()
    }
    clearForm()
    if(validateForm(trainob)){
        return trainob
    }   
    return false
}
function validateForm(trainob){

}
function clearForm(){
    $('#trainName').val('')
    $('#destination').val('')
    $('#trainArriveH').val('')
    $('#trainArriveM').val('')
    $('#frequency').val('')
}
function createRow(_rowData) {
   
    
    var cellName = $('<td>')
    cellName.text(_rowData.trainName)
    var cellDest = $('<td>')
    cellDest.text(_rowData.destination)
    var cellFirst = $('<td>')
    cellFirst.text(_rowData.firstTrain)
    var cellFrequency = $('<td>')
    cellFrequency.text(_rowData.frequncy)
    var cellNextTrain = $('<td>')
    cellNextTrain.text(_rowData.frequncy)
    cellNextTrain.attr('id','train_'+trainRow)
    var row = $('<tr>')
    row.append(cellName)
        .append(cellRole)
        .append(cellStartDate)
        .append(cellMonthsWored)
        .append(cellPayRate)
        .append(cellTotalBilled)
        trainRow++
    return row

}
function toMoney(_numbers) {
    var prefix = "$ "
    return prefix + parseFloat(_numbers).toFixed(2)
}
function getTimeofNextTrain(_hh,_mm) {
    var time = hhmmTimeToMoment(_hh,_mm)
    return getTimeDiffInMinutes(time)
}
function hhmmTimeToMoment(_hh,_mm) {
    return moment(_hh + ":" + _mm, "HH:MM");
}
function getTimeDiffInMinutes(_moment) {
    return moment().diff(moment(_moment), 'minutes', true)
}


