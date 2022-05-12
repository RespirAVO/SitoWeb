const ugm3Values = {
    SO2: 2.62,
    NO2: 1.88,
    NO: 1.25,
    O3: 2.00,
    CO: 1.145
};  

function ppbToGm3(value, field) {
    return value * ugm3Values[field.replace('(ppb)', '').trim().toUpperCase()];
}

function gm3ToPpb(value, field) {
    return value * (1 / ugm3Values[field.replace('(ug/m3)', '').trim().toUpperCase()]);
}

async function csvToObj(fileName) {
    return new Promise((succ) => {
       
        $.get('./rilevazioni/' + fileName, csvString => {
            let csvStringParsed = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;
            succ(csvStringParsed);
        });
    });
}

export default{
    ppbToGm3,
    gm3ToPpb,
    csvToObj
};