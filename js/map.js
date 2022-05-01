import Icons from "./icons.js";

const map = L.map('mappaR', {
    center: [0, 0], // posizionamento iniziale 
    zoom: 15,  // Zoom della mappa che puo andare da 1 a n dove n è uguale a maxZoom nel layer
    scrollWheelZoom: false
});

//creazione layer da mettere dontro la mappa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&amp;copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);


$.get('../data.csv', csvString => {

    // Papa parse libreria per parsare file CSV e JSON https://www.papaparse.com/
    let data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

    map.panTo([data[0].latitude, data[0].longitude]);// riposiziona il riferimento centrale della mappa al primo punto

    for (const row of data) {

        let popupMsg = '';

        for (const key of Object.keys(row))
            popupMsg += key + ': ' + row[key] + '<br>';

        const marker = L.marker([row.latitude, row.longitude], {
            icon: (row['superato limite'].split(' ')[0] === 'SI' ? Icons.red : Icons.green),
            opacity: 1
        }).addTo(map);

        marker.bindPopup(popupMsg);
    }
});