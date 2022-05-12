let datasets = []


const loadGraphData = new Promise((res, rej) => {
    $.get('../data.csv', csvString => {
        
        // Papa parse libreria per parsare file CSV e JSON https://www.papaparse.com/
        let data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;
    
        
        
        for(const key of Object.keys(data[0])) {
            if(key === 'timestamp' || key === 'latitude' || key === 'longitude')
                continue;
            
            const color = `${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}`;
            datasets.push({ label: key, data: [], borderColor: `rgb(${color})`, backgroundColor: `rgba(${color}, 0.5)`});
            
        }
        
        for(const row of data) {
            datasets.forEach(async dataset => {
                if(!row[dataset.label])
                    return;
                
                dataset.data.push( { x: dayjs(row.timestamp + 1646002800000,'x').format('DD/MM/YYYY hh:mm:ss'), y: row[dataset.label]  } )
            });
        }

        res(datasets);
    });
});



loadGraphData.then((datasets) => {
    
    new Chart('grafico', {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'dd/MM/yyyy hh:mm:ss',
                        unit: 'day',
                        stepSize: 20,
                        displayFormats: {
                           'day': 'dd/MM/yyyy hh:mm:ss'
                        }
                    }
                }
            }
        }
    });
    
});
