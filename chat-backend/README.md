#sequelize

Add .env
API_KEY=your_api_key
APP_URL=your_app_url
APP_PORT=3001

DB_HOST=localhost
DB_USER=your_db_user  
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_database

```
<!-- create model -->
sequelize model:create --name User --attributes firstName:string,lastName:string,email:string,password:string,gender:string,avatar:string --force
sequelize db:migrate
// create dummy data
sequelize seed:create --name users
// insert all
sequelize db:seed:all
// delete all
sequelize db:seed:undo
// create chat
sequelize model:create --name Chat --attributes type:string
sequelize model:create --name ChatUser --attributes chatId:integer,userId:integer
sequelize model:create --name Message --attributes type:string,message:text,chatId:integer,formUserId:integer
sequelize db:migrate
```
