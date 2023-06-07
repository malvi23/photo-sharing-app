# photo-sharing-app

## Prerequisites:
- npm: 
```sh
  npm install npm@latest -g
  ```
- Nodejs: https://nodejs.org/en
- Mongodb: https://www.mongodb.com/try/download/community
- mongodb compass: https://www.mongodb.com/try/download/compass
- Angular CLI:
```sh
  npm install -g @angular/cli
  ``` 
- Nodemon:
```sh
  npm i -g nodemon
  ```
- Git: https://git-scm.com/downloads


## Installation:
1. Create a project folder on your system
2. Git clone repo - CMD --> Go to Project folder path --> 

```sh
  git clone https://github.com/malvi23/photo-sharing-app.git
  ```
3. In cmd, go to <Project_Folder>\photo-sharing-app-client and Install client npm dependencies
```sh
  run 'npm i'
  ```
4. same for Server dependencies, go to <Project_Folder>\photo-sharing-app-server
```sh
  <Project_Folder>\photo-sharing-app-server run 'npm i'
  ```
5. Open Mongodb Compass:
- create database 'photoSharingDB'
- Create 2 collections: 'photos' and 'users'
- Connect the database

6. Start mongodb server:
- Open cmd and go to MongoDB bin folder path e.g. C:\Program Files\MongoDB\Server\<Version 5.0/6.0>\bin
- create folder "mongo-data" where you want to store mongodb supporting data e.g. "C:\Users\Desktop\<USER_FOLDER_NAME>\"
- Run mongod.exe --dbpath "C:\Users\<USER_FOLDER_NAME>\mongo-data"

7. In cmd, start node server:

```sh
  <Project_Folder>\photo-sharing-app-server run 'nodemon server.js'
   ```

```sh
  <Project_Folder>\photo-sharing-app-server run 'ng serve'
  ```
8. Open browser and hit 'localhost:4200'
