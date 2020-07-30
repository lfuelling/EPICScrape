# EPICScrape

Tool to periodically download images and metadata from NASA DSCOVR/EPIC.

https://epic.gsfc.nasa.gov/ 

## Usage

This tool is intended to be started by cron and will fetch "yesterdays" (`new Date() - 1 day`) metadata and from that fetch all images present in it.
After fetching each image, the corresponding metadata will be saved in full in a `.json` file with the same name as the image.

You can configure the destination directory in `config.json`.

## Disclaimer

This tool is neither produced nor endorsed by NASA.
