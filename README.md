# EPICScrape

Tool to periodically download images and metadata from NASA DSCOVR/EPIC.

https://epic.gsfc.nasa.gov/ 

## Usage

This tool is intended to be started by cron and will fetch "yesterdays" (`new Date() - 1 day`) metadata and from that fetch all images present in it.
After fetching each image, the corresponding metadata will be saved in full in a `.json` file with the same name as the image.

You can configure the destination directory in `config.json`.

I'd recommend creating a `fetch.sh` script somewhere that will be called by cron. It should look like this:
```shell script
#!/bin/bash
cd /mnt/path/to/EPICScrape/
/mnt/path/to/nodejs/bin/node index.js
```

The cron line should look like:
```crontab
0 0 * * * /path/to/fetch.sh >/mnt/path/to/logs/fetch-`date +\%Y/\%m/\%d`.log 2>&1
```

This will result in a scrape every day at midnight. 
Everything after the `fetch.sh` is responsible for creating a file like `/mnt/path/to/logs/fetch-20200101.log` containing all the output including errors. 

## Disclaimer

This tool is neither produced nor endorsed by NASA.
