### Muhamad Royhan Fadhli

# Taks Chapter 5

### 1. Documentation

- After runned program go to `http://localhost:3000/api-docs`

### 2. Running unit testing

- Test

```
npm run test
```

- Test by Coverage

```
npm run test:watch
```

# Taks Chapter 4

## How To Use

### 1. Database

- runing postgreSQL
- make migration `npx prisma migrate dev`
- generate seeder `npm run seed`

### 2. Runing Program

- install dependencies `npm install`
- `npm run dev` for development
- `npm run start` for production

# Taks Chapter 3

### ERD

ERD file is in the `public/` folder with the name ERD.erdplus
<img src="./public/img/ERD.png">

### Database

### 1. Generate Database

- create database with query at db/generate_database.sql
  `CREATE DATABASE banking_system;`

### 2. Make Migration Table

- Go to db/migration
- run all queries in the `.sql` file located in the migration folder except for the ones in the procedure folder

### 3. Create Seeder data (Data Dummy)

- Go to db/ seeder
- run all queries on the `.sql` file located in the seeder folder

### 4. You Can Continue Use All Query At :

- db/query ` Basic Query`
- db/migration/procedure ` Procedure Query`

# Taks Chapter 2

### For Runing The Program

```
node banking_system.js
```

### FlowChart

<img src="./public/img/flowcart.jpg">
