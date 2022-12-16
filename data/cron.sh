# verify if this package is installed 
folderPath="$(pwd)"
echo $folderPath
exit
# array of packages to check
check_dependencies () {
	# checks if dependencies are present
	for dep; do
		if ! command -v "$dep" >/dev/null ; then
			error "Program \"$dep\" not found. Please install it. \n Type \"scoop install $dep\" if you're using windows or type apt-get install $dep"
			print_white "Exiting..."
			die			
		fi
	done
}


check_dependencies "node" "npm" "crontab"

# check if crontab is running if not start it
if ! crontab -l > /dev/null 2>&1; then
    echo "Crontab is not running, starting it..."
    # export EDITOR=nvim # set nano of vim 
    crontab -e
fi
# run trailer.js script every hour

if ! crontab -l | grep -q "trailer.js"; then
  echo "Adding cron job to crontab..."
  (crontab -l) | { cat; echo "0 * * * * cd $folderPath/movie && node trailer.js"; } | crontab -
fi

if ! crontab -l | grep -q "trailer.js"; then
    echo "Adding cron job to crontab..."
    (crontab -l ; echo "0 15 * * * cd $folderPath/movies && node trailer.js") | crontab -
fi


# run movies.js script once a month at midnight
if ! crontab -l | grep -q "movies.js"; then
    echo "Adding movies.js to crontab..."
    (crontab -l ; echo "0 0 1 * * cd $folderPath/movies/ && node movies.js") | crontab -
fi

# run getMoviesTitle.js script once a 2nd day of month at 5:00
if ! crontab -l | grep -q "getMoviesTitle.js"; then
    echo "Adding getMoviesTitle.js to crontab..."
    (crontab -l ; echo "0 5 2 * * cd $folderPath/movies/ && node getMoviesTitle.js") | crontab -
fi

# run getSeriesTitle.js script once a month 3rd day at 5:00
if ! crontab -l | grep -q "getSeriesTitle.js"; then
    echo "Adding getSeriesTitle.js to crontab..."
    (crontab -l ; echo "0 5 3 * * cd $folderPath/series/ && node getSeriesTitle.js") | crontab -
fi


# run series.js script once a month at midnight 4th day
if ! crontab -l | grep -q "series.js"; then
    echo "Adding series.js to crontab..."
    (crontab -l ; echo "0 0 4 * * cd $folderPath/series/ && node series.js") | crontab -
fi

# run getActors.js script once a week at 7:00
if ! crontab -l | grep -q "getActors.js"; then
    echo "Adding getActors.js to crontab..."
    (crontab -l ; echo "0 7 * * 1 cd $folderPath/actors/ && node getActors.js") | crontab -
fi

# run actors.js script once a week at 11:00
if ! crontab -l | grep -q "actors.js"; then
    echo "Adding actors.js to crontab..."
    (crontab -l ; echo "0 11 * * 1 cd $folderPath/actors/ && node actors.js") | crontab -
fi


# cron job test, execute every minute

if ! crontab -l | grep -q "test"; then
		echo "Adding test.js to crontab..."
		(crontab -l ; echo "* * * * * notify-send hello world") | crontab -
fi 

# added cron job to crontab
echo "Cron job added to crontab" 
crontab -l
