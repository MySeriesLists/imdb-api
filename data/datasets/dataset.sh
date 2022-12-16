check_dependencies () {
	# checks if dependencies are present
	for dep; do
		if ! command -v "$dep" >/dev/null ; then
		 
				echo "Program \"$dep\" not found. Please install it. Type \"scoop install $dep\" if you're using windows or type apt-get install $dep"
			
			print_white "Exiting..."
			exit			
		fi
	done
}

check_dependencies curl gunzip zip awk
# data set donwload from imdb dataset with curl
curl 'https://datasets.imdbws.com/title.basics.tsv.gz' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' -H 'Accept-Language: tlh,en-US;q=0.8,fr-FR;q=0.5,en;q=0.3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Referer: https://datasets.imdbws.com/' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Upgrade-Insecure-Requests: 1' -H 'Sec-Fetch-Dest: document' -H 'Sec-Fetch-Mode: navigate' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-User: ?1' -H 'TE: trailers' -o title.tsv.gz

# extract the file
# verify if the file exist
if [ -f title.tsv.gz ]; then
    rm -f title.tsv
   # extract the file
    gunzip title.tsv.gz
    # remove the file
    rm -rf title.tsv.gz
fi


# verify if the file doesnt exist
if [ ! -f title.tsv ]; then
    echo "File not found!"
    exit 1
fi

echo "Processing the file..."

# extract the tconst and runtimeMinutes columns from the tsv file and save it to a csv file 
awk -F '\t' '{print $1","$8}' title.tsv > title.csv

rm -rf title.tsv


# create a zip file of dataset 

cd ../

if [ -f dataset.zip ]; then
	echo "Removing old dataset.zip"
	rm -rf dataset.zip
fi

zip -r dataset.zip datasets

echo "Done!"

ehco "Launching nodejs server for the dataset run time"
node ../series/runTime.js

