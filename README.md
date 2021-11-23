# Raincoat Enrollment App


**Requirements**

1. node 14.17.3
2. react-native-cli
3. cocoapods (ios) 1.11.2
4. docker desktop

Note: If you've not environment setup for React Native Application, you can set up by following this url in your local machine.
https://reactnative.dev/docs/environment-setup
  
**Instructions**

1. run `npm install` or `yarn install`
2. run `cd ios && pod install`
3. back to project folder and run `npm start` to start the package
4. open another terminal and run `react-native run-ios` or `react-native run-android` from VSCode or you can open project from xcode and android studio to run      application.
5. start developing

**Local Development Database**

1. run `docker compose up -d`
2. open `http://127.0.0.1:5984/_utils/` in the browser
3. login with username: `admin` and password `couchdb`
4. create a database names `enrollees`

**Seed Database**

1. run `yarn seed-db`

**Enrollee Model for México**

Current database fields (WIP):

Name | Doc Field Name | Description
---|---|---
Nombre | firstName | The enrollee's first name
Apellido Paterno | lastName | The enrollee's last name
Apellido Materno | surName | The enrollee's surname
Fecha de nacimiento | dob | The enrollee's date of birth
CURP | curp | The enrollee's government ID number
Sexo | gender | The enrollee's gender
Numero de celular | mobilePhone | The enrollee's mobile phone
Calle y numero | address1 | The enrollee's street address line 1
Localidad | locality | The enrollee's locality
Ejido | TBD | TBD
Municipio | municipality TBD | The enrollee's municipality
Entidad Federativa | TBD | TBD
Coordenadas | geoJson | The enrollee's coordinates in geoJson
Superficie asegurada | coveredArea | The enrollee's covered crop  area
Cultivo | crop | The enrollee's covered crop
Tipo de cultivo | cropType | The enrollee's covered crop type
Ciclo (Temporada de Cobertura) | cropCycle | The season for the covered crop
Fecha de solicitud | applicationTime | The date of application
Folio de seguimiento | publicId | The policy's public id
Inicio de Vigencia | effectiveTime |The policy's active date
CLABE | TBD | TBD
Numero de tarjeta | TBD | TBD
