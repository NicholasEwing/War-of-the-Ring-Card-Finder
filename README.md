# War of The Ring - Event Card Finder

In this project, I've created a web application where you can search and find event cards from the popular War of the Ring (2nd Edition) board game.

Technologies used:

- HTML5
- CSS3
- JavaScript
- Node.js
- Express / EJS
- MongoDB / Mongoose
- Heroku

TODO:

- **Initial setup**
  _ ~~Put in sample cards~~
  _ ~~Create JSON file with mongoexport for seeding db later~~
  _ ~~change card creation form to allow images for hunt tiles~~
  _ ~~change card schema to include optional hunt tile image~~
  _ ~~add "improved card text" to schema~~
  _ ~~split creation form into separate route~~
- **Assets**
  _ ~~create all image assets for card background (shadow / fp)~~
  _ ~~turns out there are 4 card size variants per faction, turn these into image assets as well~~
  _ create FP character icon
  _ create Special Hunt Tile icons
- **CSS**
  _ ~~create basic CSS styling for cards~~
  _ ~~figure out proper CSS styling & spacing for card text - each card size has its own styling rules~~
  _ ~~Event title~~
  _ ~~Event precondition~~
  _ ~~Event text~~
  _ ~~Event discard condition~~
  _ ~~Combat title~~
  _ ~~Combat precondition~~
  _ ~~Combat text~~
  _ ~~Combat discard condition~~
  _ ~~Combat initative number~~
  _ ~~card number (collection)~~
  _ ~~Polish card images, remove white pixels on edge in Photoshop and improve textures~~
  _ ~~Blank-FP-Card-1 (remove white background on card #)~~
  _ ~~Blank-FP-Card-2 (remove white background on card #)~~
  _ ~~Blank-FP-Card-3 (remove white background on card #)~~
  _ ~~Blank-FP-Card-4 (remove white background on card #)~~
  _ ~~Blank-Shadow-Card-4 (need to move right slightly)~~
- **Search feature**
  _ ~~create search function to find card titles in DB~~
  _ ensure card type icons are set
  _ ~~free peoples~~
  _ shadow
  _ ~~ensure correct card bg and card size are chosed~~
  _ ~~enable fuzzy searching~~
  _ enable all text fields to be queried, not just card titles
  _ ~~title~~
  _ ~~text~~
  _ ~~precondition~~
  _ ~~discard condition~~
  _ ~~all combat text~~
  _ ~~search by faction ("shadow, free peoples, fp, free people, etc")~~
  _ enable page navigation on several results
  _ ~~enable page counter~~
  _ ~~move left~~
  _ ~~move right~~
  _ ~~highlight query on new suggestions~~ \* ~~render card when selected~~
- **Polish**
  _ ~~move combat init number down slightly~~
  _ Use module pattern
  _ dry up code completely before moving on
  _ change suggestion highlight color and bg based on faction (red for shadow, blue for free peoples)
  _ check if it's safer to use innerText instead of innerHTML for text change
  _ make app look like an actual website, add background, contact info, links to ares, etc
  _ maybe add useful shortcut buttons? ("show all shadow, show all fp, show all character, etc?")
  _ find way to preload bg images and cache them to prevent white flash on initial search
  _ ~~don't make nav bar highlight on hover, don't allow nav bar focus~~
  _ ~~add card icon (muster / army / character) on suggestion lis~~
  _ need to fix some SUPER minor white space issue with shadow icons
  _ ~~allow card flip to show relevant cardback~~
  _ ~~ensure type-ahead suggestions can be navigated and selected with arrow keys + enter~~
  _ ~~up and down arrows work~~
  \_ ~~left and right arrows navigate pages~~
- **Data Entry**
  _ enter all 100+ cards into the system (might have to do this manually)
  _ add improved text for all cards
  _ check for typos
  _ check for typos AGAIN
- **Deploy**
  _ perform basic linting
  _ clean up code for readability \* push to Heroku
