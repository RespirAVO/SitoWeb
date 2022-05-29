"use strict";
import Utils from "./utils.js";

const forbiddenFields = ['timestamp', 'latitude', 'longitude', 'latitudine', 'longitudine'];  
const fileList = document.querySelector('#fileList');

const graph = new Chart('grafico', {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    parser: 'dd/MM/yyyy HH:mm:ss',
                    unit: 'hour',
                    stepSize: 1,
                    displayFormats: {
                       'hour': 'dd/MM/yyyy HH:mm:ss'
                    }
                }
            }
        }
    }
});

async function drawGraphFormFile(graph, fileName) {
    let datasets = [];
    let data = await Utils.csvToObj(fileName + '/rilevazioni.csv');

    data = data.sort((a,b) => b.timestamp - a.timestamp);

    for(const key of Object.keys(data[0])) {
        if(forbiddenFields.indexOf(key) !== -1)
            continue;
        
        const color = `${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}`;
        datasets.push({ label: key, data: [], borderColor: `rgb(${color})`, backgroundColor: `rgba(${color}, 0.5)`, tension: 0.1});
    }

    for(const row of data) {
        datasets.forEach(dataset => {
            if(!row[dataset.label])
                return;
            
            dataset.data.push( { x:dayjs(row.timestamp * 1000,'x').format('DD/MM/YYYY HH:mm:ss'), y: row[dataset.label]  } )
            console.log(dataset.label + " " + row[dataset.label] + " " + row.timestamp);
        });
    }

    graph.config.data.datasets = datasets;
    graph.update();
}

drawGraphFormFile(graph, fileList.value);

fileList.addEventListener('change', e => {
    drawGraphFormFile(graph, fileList.value);
});