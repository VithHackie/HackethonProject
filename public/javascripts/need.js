const socket = io();

const customIcon = L.icon({
    iconUrl: "/images/location.png",     // your image
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    tooltipAnchor: [0, -40],
});

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((pos)=>{
        const {latitude, longitude} = pos.coords
        socket.emit("send-location-needer", {latitude, longitude})
        console.log(latitude + " " + longitude)
    }, (err)=>{
        console.error(err);
    }, {
        enableHighAccuracy : true,
        timeout : 5000,
        maximumAge : 0,

    })
}

const map = L.map("map").setView( [28.6139, 77.2090], 13)

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution:"OpenStreetMap"
}).addTo(map)

const markers = {};
firstimeLoad = true
socket.on("recieve-location-helper", (data)=>{
    const {id, latitude, longitude, user, restaurant, phoneno, food, amount} = data;
    // map.setView([latitude, longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude])

    }else{
        markers[id] = L.marker([latitude, longitude], {icon : customIcon})
            .addTo(map)
            .bindTooltip(`Name - ${user}<br>Place Name - ${restaurant} <br> Phone No. - ${phoneno} <br> Food Type - ${food} <br>Amount - ${amount}Kgs`, {
                permanent : true,
                direction : top,
                offset: [0, -10]
            })
    }
})

// Add to help.js and need.js

socket.on("load-existing-helpers", (helpers) => {
    helpers.forEach((data) => {
        const {id, latitude, longitude, user, restaurant, phoneno, food, amount} = data;
        
        // Only add if marker doesn't exist yet
        if(!markers[id]){
            markers[id] = L.marker([latitude, longitude], {icon : customIcon})
            .addTo(map)
            .bindTooltip(`Name - ${user}<br>Place Name - ${restaurant} <br> Phone No. - ${phoneno} <br> Food Type - ${food} <br>Amount - ${amount}Kgs`, {
                permanent : true,
                direction : 'top',
                offset: [0, -10]
            });
        }
    });
});

socket.on("recieve-location-needer", (data)=>{
    const {id, latitude, longitude} = data
    map.setView([latitude, longitude])
})

socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
    // window.location.reload()
})


