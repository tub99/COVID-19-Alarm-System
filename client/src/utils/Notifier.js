import { NotificationManager } from 'react-notifications';
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
        var notification = new Notification("COVID-19 Updates", options);
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification("Updates! ", options);
            }
        });
    }
}

const notifyAboutCovidUpdates = () => {
    NotificationManager.info("New updates available! \n\n Check for Map highlight updates. \n\n Scroll to the Notifcation section for more details")
}

const notifyDeviceRegistrations = () => {
    NotificationManager.info("Application synced! \n\n Get regular updates by refreshing page!")

}

export { notifyCovidUpdates, notifyAboutCovidUpdates, notifyDeviceRegistrations };