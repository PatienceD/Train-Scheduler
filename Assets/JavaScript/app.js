$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBtMK_-XJhXOy7uhilswtbDG8YumjVPYHs",
        authDomain: "train-scheduler-1b265.firebaseapp.com",
        databaseURL: "https://train-scheduler-1b265.firebaseio.com",
        projectId: "train-scheduler-1b265",
        storageBucket: "train-scheduler-1b265.appspot.com",
        messagingSenderId: "919428230957"
    };

    firebase.initializeApp(config);

    //creates the varible to reference the database
    var database = firebase.database();

    //capture button click
    $("#submit").on("click", function (event) {
        event.preventDefault();

        var trainName = $("#name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainTime = $("#time-input").val().trim();
        var trainFrequency = $("#frequency-input").val().trim();

        var trainData = {
            name: trainName,
            destination: trainDestination,
            time: trainTime,
            frequency: trainFrequency
        };

        database.ref().push(trainData);

        console.log(trainData.name);
        console.log(trainData.destination);
        console.log(trainData.time);
        console.log(trainData.frequency);

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    });

    database.ref().on("child_added", function (childSnapshot) {

        //logging everything that's coming out of snapshot
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFirstTime = childSnapshot.val().time;
        var trainFrequency = childSnapshot.val().frequency;

        var timeArr = trainFirstTime.split(":");
        var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);

        console.log(trainName);
        console.log(trainDestination);
        console.log(trainTime);
        console.log(trainFrequency);


        //MATH <---------------------------
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(trainTime);
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

        // Difference between the times
        var diffTime = currentTime.diff(firstTimeConverted, "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tminutesTilTrain = trainFrequency - tRemainder;
        console.log("MINUTES TIL TRAIN: " + tminutesTilTrain);

        // Next Train
        var nextTrain = moment().add(tminutesTilTrain, "minutes");
        console.log("ARRIVAL TIME: " + nextTrain.format("hh:mm"));

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainTime),
            $("<td>").text(trainFrequency),
            $("<td>").text(nextTrain),
            $("<td>").text(tminutesTilTrain)
        );

        $("#schedule").append(newRow);


    }, function (errorObject) {
        console.log("Error's held here: " + errorObject.code);
    });

});


//dataRef.ref().orderByChild("dateAdded".limitToLAst(1).on("child_added", function (snapshot){
    //$("#").tet(snapshot.val().name)
//}))