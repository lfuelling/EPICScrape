const format = require('date-fns/format')
const sub = require('date-fns/sub')
const fetch =  require('node-fetch');
const util = require('util')
const fs = require('fs')
const streamPipeline = util.promisify(require('stream').pipeline)

const config = require('./config.json');

function checkStatus(res) {
    if (res.ok) {
        return res;
    } else {
        throw Error(res.statusText);
    }
}

const date = sub(new Date(), {days: 1});
const metadataUrl = `https://epic.gsfc.nasa.gov/api/natural/date/${format(date, "yyyy")}-${format(date, "MM")}-${format(date, "dd")}`;
const archiveUrl = `https://epic.gsfc.nasa.gov/archive/natural/${format(date, "yyyy")}/${format(date, "MM")}/${format(date, "dd")}/png/`;

async function downloadData(metadata) {
    await fetch(archiveUrl + metadata.image + '.png')
        .then(checkStatus)
        .then(function(res) {
            console.log("Saving '" + metadata.image + "'...");
            return streamPipeline(res.body, fs.createWriteStream(config.destinationDir + metadata.image + '.png'));
        })
        .then(_ => {
            fs.writeFile(config.destinationDir + metadata.image + '.json', JSON.stringify(metadata), 'utf8', function (err) {
                if (err) {
                    return console.error("An error occurred while saving the metadata for '" + metadata.image + "'!", err);
                }
                return console.log("Saved '" + metadata.image + "' successfully.");
            })
        })
        .catch(err => console.error(err));
}

console.log('Fetching images for ' + format(date, "dd/MM/yyyy") + '...');

fetch(metadataUrl)
    .then(checkStatus)
    .then(res => res.json())
    .then(async json => await json.forEach(await downloadData))
    .catch(err => console.error(err))
    .then(_ => console.log('Fetched metadata for ' + format(date, "dd/MM/yyyy") + '!'));
