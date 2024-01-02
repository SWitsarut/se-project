# Setup project

1. clone repository

   ```sh
   git clone https://github.com/SWitsarut/se-project
   ```

2. go to folder

   ```sh
   cd se-project
   ```

3. build docker compose

   ```sh
   docker-compose up -d --build
   ```

4. copy .env.template and rename that to .env and config your env

5. install package

   ```sh
   cd .\client\
   npm i
   npx prisma db push
   npx prisma generate
   # open new terminal
   cd .\server\
   npm i
   ```

6. run project

   ```sh
   #in client directory
   npm run dev
   #in server directory
   npm run dev
   ```
