# Shelf
A comic database and collection management tool

# Setup
Before running, you will need to make sure you have the latest version of node.js, npm, and mongodb installed and configured.  Make sure mongodb is already running, then follow these steps to get the project set up and ready for development:
1. Install nodemon (Note: you may need to prepend the following command with `sudo`)
`
npm i -g nodemon
`
1. Clone the repository
`
git clone git@github.com:gabeotisbenson/shelf.git
`
1. Enter the directory and install necessary dependencies
`
npm i
`
1. Restore the mongodb dump
`
mongorestore dump
`
1. Now, simply start nodemon and you should be good to go!
`
nodemon
`

##Search Planning:
* Search results should be based on two main factors: most significant series and most recent, as thouse are probably the most importnat to people.
* Below those two sections, all other results can display with advanced date filtering.  
* Need to also optimize for "talent" searches. For expample, if someone searches for Jack Kirby, his most significant and most recent results should
show.  It would also be cool if we could display a picture of him... but that might be wishful thinking or a whole separate database.
