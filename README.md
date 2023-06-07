# photo-sharing-app

## Installation:
- npm: npm install npm@latest -g
- Nodejs: https://nodejs.org/en
- Mongodb: https://www.mongodb.com/try/download/community
- mongodb compass: https://www.mongodb.com/try/download/compass
- Angular CLI: npm install -g @angular/cli
- Nodemon: npm i -g nodemon
- Git: https://git-scm.com/downloads


## Steps:
1. Create project folder
2. Git clone repo - CMD --> Go to Project folder path --> 

```sh
  git clone https://github.com/malvi23/photo-sharing-app.git
  ```
4. Go to 10KC Challenge- Malvi\photo-sharing-app-client run 'npm i'
5. Go to 10KC Challenge- Malvi\photo-sharing-app-server run 'npm i'

Create database 'photoSharingDB' using Mongodb Compass
Create 2 collections: 'photos' and 'users'
Connect the database

Start mongodb server:
- Open cmd and go to MongoDB bin folder path e.g. C:\Program Files\MongoDB\Server\6.0\bin
- create folder "mongo-data" where you want to store mongodb supporting data e.g. "C:\Users\<USER_FOLDER_NAME>\"
-Run mongod.exe --dbpath "C:\Users\<USER_FOLDER_NAME>\mongo-data"

Start node server:
Go to 10KC Challenge- Malvi\photo-sharing-app-server run 'nodemon server.js'

Start angular server:
Go to 10KC Challenge- Malvi\photo-sharing-app-server run 'ng serve'

Open browser and hit 'localhost:4200'
