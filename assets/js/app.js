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
var trainTimeObj = function () {
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
    var trainRow = 0;
    var timerRef;
    var isAdding = false;
    var timmer;
    var timeIcon = '<img src="assets/images/noun_clock_555527.svg">';
    var deleteTrainIcon = '<i class="far fa-calendar-times"></i>';
    $(document).ready(function () {
        $('#timelogo').append(timeIcon)

        database.ref('trains').on('child_added', function (snap) {

            if (snap) {
                var data = snap.val()
                data.key = snap.key
                var tr = createRow(data)

                $('#tableBody').append(tr)
            }

        })

        $('#addit').click(function (event) {
            $('#validation').hide()
            $('#addit').prop('disabled', true)
            if (!isAdding) {
                isAdding = true;
                var trainData = makeTrainObject()
                if (trainData !== false) {
                    database.ref('trains').push(trainData)
                }

                isAdding = false;
            }
            $('#addit').prop('disabled', false)
            return
        })
         $('#remove').click(function (event) {
            clearInterval(timmer)
             $('#admintrain').modal('hide')
              
             $('.remove').show()
                timerRef = setTimeout(function () {
                 $('.remove').hide()
                  timmer = setInterval(updateTimeofNextTrain, 1000)
                 clearTimeout(timerRef)
             }, 20000)
         })
        

        $('#trainArriveH').focusout(digithelperS)
        $('#trainArriveM').focusout(digithelperS)
        $('#frenquency').focusout(digithelperS, true)

      timmer =   setInterval(updateTimeofNextTrain, 1000)
    })

    function digithelperS(event, l = false) {
        var f = event.target.value
        if (!l) {
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
    function digithelper(_val, l = false) {
       
        if (!l) {
            if (parseInt(_val) < 10 && parseInt(_val) > -1) {
                _val = "0" + _val
                
            } else if (parseInt(_val) == -1) {
               _val = "00"
            } else {
                _val = _val
            }
        } else {
            if (_val < 10) {
               _val = _val
            }
        }

        return _val

    }

    function makeTrainObject() {

        var trainob = {
            trainName: $('#trainName').val(),
            destination: $('#destination').val(),
            trainArriveH: $('#trainArriveH').val(),
            trainArriveM: $('#trainArriveM').val(),
            frequency: $('#frequency').val(),
            has1stTrainArrived: false
        }

        if (validateForm(trainob)) {
            clearForm()
            return trainob
        }
        return false
    }

    function validateForm(_trainob) {
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

    function clearForm() {
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
        cellFirst.text(moment(timeFirst, 'HH:mm').format('LT'))
        // checks too see if the first train has arrived. 
        var firstTrainCame = moment().isSameOrAfter(moment(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "HH:mm"))
        var cellFrequency = $('<td>')
        cellFrequency.text(_trainob.frequency)
        var frequency = parseFloat(_trainob.frequency * 60) // in seconds
        console.log("Train comes every " + frequency + " seconds")
        var cellNextTrain = $('<td>')
        var trid = 'train_' + trainRow
        cellNextTrain.attr('id', trid)

        //---------------------------------------------Time Of Next Train-----------------------------------------------------//
        //Holder of minutes till next train
        var ntrainTime;
        //Get cuurent time as a moment object
        var currentTime = new moment()
        //Convert time stored in database to a momment
        var startTime = new moment(_trainob.trainArriveH + ":" + _trainob.trainArriveM, "LT")
        //Determine if the first train has arrived
        if (firstTrainCame) {
            //Call function to calculate remaining wait time in minutes
            var momentofTime = timeOfNextTrain(startTime, frequency, currentTime)
            var min = parseInt(momentofTime.asMinutes())
            
            var seconds = parseInt(momentofTime.asSeconds() % 60)
            ntrainTime = digithelper(min) + ":" + digithelper(seconds)
            if (min >= 60) {
                var dur = moment.duration(startTime.diff(currentTime))
                ntrainTime = dur.humanize()
            }
        } else {
            var dur = moment.duration(startTime.diff(currentTime))
            ntrainTime = dur.humanize()
        }
         cellNextTrain.removeClass('arrive')
        if (seconds <= 3 && min <= 0) {
           
            cellNextTrain.addClass('arrive')
            cellNextTrain.text("TRAIN IS ARRIVING")
        } else {
            cellNextTrain.text(ntrainTime)
        }
        if (timerRef) {
           
            var delicon = $('<td>').addClass('remove')
            delicon.html(deleteTrainIcon).attr('id', 'remove_' + trainRow).data('key', _trainob.key)
            var dkey = _trainob.key
            $('#remove_' + trainRow).click(function (event) {
                    clearTimeout(timerRef)
                $('.remove').hide()
               var dk =  $(this).data('key')
                database.ref('trains/' + dk).remove()
                $(event.target.parentNode).empty()
                    timmer = setInterval(updateTimeofNextTrain, 1000)
                    
            })
        }
        var row = $('<tr>')
        row.append(cellName)
            .append(cellDest)
            .append(cellFirst)
            .append(cellFrequency)
            .append(cellNextTrain)
            .addClass('td-center')
            .append(delicon)
        trainRow++
        return row

    }

    function timeOfNextTrain(_startTime24, _frequencyInSec, _currentTime24) {

        //formula for this is 
        // currenttime - starttime = minuetsPastSinceFirstTrain (Convert to seconds) * 60
        // secondsPassed / the frequencey in seconds of then other trains = number of trains that have passed (The remainder gives us the fraction of how long ago the last train left) convert to seconds
        // frequency - the above remainder = seconds left till next train

        console.log("time of first train " + _startTime24.format('HH:mm'))

        var timePastSinceFirstTrain = moment.duration(_currentTime24.diff(_startTime24))
        console.log("Seconds past since first train " + timePastSinceFirstTrain.asSeconds())

        var numberOfTimesTrainHasCome = (timePastSinceFirstTrain.asSeconds() / _frequencyInSec)
        console.log("Time Train Has Came " + numberOfTimesTrainHasCome)

        var secondsLastTrainLeft = (timePastSinceFirstTrain.asSeconds() % _frequencyInSec)
        console.log("Remainder number of seconds since last train left" + secondsLastTrainLeft)

        console.log("Minutes since last train has left = " + moment.duration(secondsLastTrainLeft, 'seconds').asMinutes())
        return moment.duration((_frequencyInSec - secondsLastTrainLeft), 'seconds')

    }


    function updateTimeofNextTrain() {
        database.ref('trains').once('value',function (snap) {
            var trains = snap
            $('#tableBody').empty();
            trains.forEach(function (childSnapshot) {
                
                var childData = childSnapshot.val();
                
                var tr = createRow(childData)
                
                 $('#tableBody').append(tr)
            });
          

        })
    }

}

trainTimeObj()