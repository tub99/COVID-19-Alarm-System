const notifyCovidUpdates = (data) => {
    let covidDelta = [...data];
    covidDelta.shift();
    let notificationBody = covidDelta.map((data) => {
        return `${data.state}: ${data.isDead} new deaths , ${data.isRecovered} new recoveries, ${data.isConfirmed} new confirmed cases`;
    })
    notificationBody = notificationBody.join('\n\n');
    console.log(data);
    notifyMe(notificationBody);
}

function notifyMe(text, audioPath) {

    var options = {
        body: text,
        icon: './logo192.png'
    };
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        var notification = new Notification("Updates!", options);
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification("Updates! ", options);
            }
        });
    }
}
export { notifyCovidUpdates };