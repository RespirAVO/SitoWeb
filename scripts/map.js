"use strict";
import Icons from "./icons.js";
import Utils from "./utils.js";

const forbiddenFields = ['timestamp', 'latitude', 'longitude', 'latitudine', 'longitudine'];  

const optsList = document.querySelector('#optionList');
const fileList = document.querySelector('#fileList');

const limitsInGm3 = {
    'PM10': 50,
    'PM25': 25,
    'O3': 120,
    'NO2': 40
};

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

const markers = L.layerGroup().addTo(map);

function drawMarkers(map, data, field) {
    markers.clearLayers();

    map.panTo([data[0].latitude === undefined ? data[0].latitudine : data[0].latitude, data[0].longitude === undefined ? data[0].longitudine : data[0].longitude]);// riposiziona il riferimento centrale della mappa al primo punto
    document.querySelector('#optionList');
    const trimmedField = field.replace('(ppb)','').replace('(ug/m3)','').trim();
    const limit = field.indexOf('(ppb)') !== -1 ? Utils.gm3ToPpb(limitsInGm3[trimmedField], trimmedField) : limitsInGm3[trimmedField];

    for (const row of data) {
        let lat = row.latitude === undefined ? row.latitudine : row.latitude;
        let lon = row.longitude === undefined ? row.longitudine : row.longitude;
        let popupMsg = '';

        for (const key of Object.keys(row))
            if(key === 'timestamp')
                popupMsg += 'data: ' + dayjs(row.timestamp * 1000,'x').format('DD/MM/YYYY hh:mm:ss') + '<br>';
            else
                popupMsg += key + ': ' + row[key] + '<br>';

        const marker = L.marker([lat, lon], {
            icon: (row[field] > (limit * 2) ? Icons.violet : 
                   row[field] > limit ? Icons.red : 
                   row[field] > (limit - (limit / 4)) ? Icons.orange : 
                   row[field] > (limit / 2) ? Icons.yellow : 
                   row[field] < (limit / 2) ? Icons.green :
                   Icons.grey),
            opacity: 1
        }).addTo(markers);

        marker.bindPopup(popupMsg);
    }
}

async function uploadMesuresFromFile(map, fileName) {
    const data = await Utils.csvToObj(fileName + '/rilevazioni.csv');
    data.pop();

    optsList.innerHTML = '';
    for (const key of Object.keys(data[0])) {
        if(forbiddenFields.indexOf(key) !== -1)
            continue;
        
        const newEle = document.createElement('option');
        newEle.setAttribute('value', key);
        newEle.innerText = key;
        optsList.appendChild(newEle);
    }

    drawMarkers(map, data, optsList.value);

    optsList.onchange = e => {
        drawMarkers(map, data, optsList.value);
    };
}

function loadImgs() {
    const numberOfFoto = fileList.querySelector('option[value="'+fileList.value+'"]').getAttribute('nFoto');
    const fotoContainer = document.querySelector('#gallery');
    fotoContainer.innerHTML = '';
    for(let i = 0; i < numberOfFoto; i++) {
        const tmpFoto = document.createElement('img');
        tmpFoto.src = './rilevazioni/' + fileList.value + '/imgs/img' + i + '.png';

        fotoContainer.append(tmpFoto);
    }
}

uploadMesuresFromFile(map, fileList.value);
$('#note').load('./rilevazioni/' + fileList.value + '/note.html');
loadImgs();

fileList.addEventListener('change', e => {
    uploadMesuresFromFile(map, fileList.value);
    $('#note').load('./rilevazioni/' + fileList.value + '/note.html');
    loadImgs();
});