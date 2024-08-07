<a href="https://familychart.onrender.com/" style="color:black"><h1 style="text-shadow:2px 2px 2px grey; font-size: 4rem;">fa<b><span style="color:red">m</span></b>il<b ><span style="color:red">y</span></b> <b><span style="color:red">chart</span></b></h1></a>

A personal charting system for families to keep track of their own health journeys. 

# The problem
When it comes to managing your families health care, there are a __LOT__ of little details to keep track of! Medications, insurance, doctors, appointments... over time, these details can get quite overwhelming! 

# The solution
Here, you can add yourself and your family members to your group, connect to each member's personal portal, and add, edit, and delete their personal health-related details. 

This will be a very helpful tool for you and your family as those details pile up over the years! After all, Nurses and Doctors keep records of your health journey... __Why can't you?__

# Check it out!

- Click the logo above to see it deployed, or click [here][familychart].
- Check out the homepage sitemap [here][home-sitemap].
- Check out the member navbar sitemap [here][navbar-sitemap].
- Check out the database schema [here][db-schema]. 

# Installation
This app is built with two respositories. You will need to clone both the [back-end repository][backend] and the [front-end repository][frontend]. The back-end is implemented with a [Express][express] stack. The front-end is implemented with a [Vite-React][vite] stack.

This app is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies.`  

This app uses [postregreSQL][psql] to establish its database. For local deployment, this should be installed locally. 

*If you would like to run tests on the back-end portion of this app, [jest][jest] should be installed as one of your back-end `dependencies.` The front-end uses vitest for testing, which is already listed in the front-end `dependencies.`*


## Back-end Installation
### Initial setup

- clone the [back-end repository][backend]
- install the dependencies

```
npm install
```
### Build the database 
```
npm run build
```
- You will be prompted to create the primary database named "physiq."

- *You can optionally build the test database "physiq_test" for testing purposes as well. Follow the prompt according to your preferences.*


- The back-end will connect to the physiq database via the files [config.js][config] and [db.js][db].

### Start the server 

```
npm run start
```

## Front-end Installation
- clone the [front-end repository][frontend]
- install the dependencies

```
npm install
```
- start the front-end 

```
npm run dev
```


## Deployment
### Port Connection
As seen in the file [config.js][config], the back-end will be deployed at port 3001, unless changed by the environmental variable "PORT". 

Locally, the front-end will be deployed at port 5173, per Vite's default port settings. 

### Database Connection
As seen in the file [config.js][config], the back-end will connect to the local database at "postgresql://localhost/physiq", unless changed by the environmental variable "DATABASE_URL". 

### Front-end to Back-end Connection

The front-end connects to the back-end server via the file [/src/Api.js][api]. 

It will by default connect to the back-end at "http://localhost:3001", unless otherwise changed by the environmental variable "VITE_APP_BASE_URL".

## Environmental Variables
Can optionally be set up as needed per your preferences. 

### Back-End Variables

- Create a .env file in the root folder of your back-end project.

- If desired, set the SECRET_KEY, PORT, and DATABASE_URL variables.

- See code below for example:
```
SECRET_KEY="my_custom_secret_key"
PORT="5000"
DATABASE_URL="some/other/database"
```
### Front-End Variables

- Create a .env file in the root folder of your front-end project.

- If desired, set the VITE_APP_BASE_URL variable.

- See code below for example:
```
VITE_APP_BASE_URL="customized_back_end_connection_url"
```
[familychart]: https://familychart.onrender.com/
[backend]: https://github.com/teeleefy/physiq_backend 
[frontend]: https://github.com/teeleefy/physiq_frontend 
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[psql]: https://www.npmjs.com/package/postgres
[jest]: https://www.npmjs.com/package/jest
[config]: https://github.com/teeleefy/physiq_backend/blob/main/config.
[db]: https://github.com/teeleefy/physiq_backend/blob/main/db.js
[vite]: https://vitejs.dev/
[express]: https://expressjs.com/
[api]: https://github.com/teeleefy/physiq_frontend/blob/main/src/Api.js
[db-schema]: https://lucid.app/lucidspark/62bef30b-557d-420c-9762-e2f305c509da/edit?viewport_loc=-2003%2C-341%2C2560%2C1279%2C0_0&invitationId=inv_a7bab510-ec4c-4f2b-b1b3-1ac94f01fc20
[home-sitemap]: https://lucid.app/lucidspark/309223a3-b399-49db-a549-f962ec7324bb/edit?viewport_loc=-2604%2C-614%2C5248%2C2792%2C0_0&invitationId=inv_4030a1ab-eac5-468b-9393-fc7f0a81ba9c
[navbar-sitemap]:https://lucid.app/lucidspark/db3dcac5-edab-4e2c-9926-b26a88f40fe3/edit?viewport_loc=-2519%2C-994%2C8200%2C4363%2C0_0&invitationId=inv_40c6a11a-7611-4cd8-af0d-22fd7cb72fd4