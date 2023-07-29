npx sequelize-cli model:generate --name Users --attributes userName:string,password:string,is_admin:string

npx sequelize-cli model:generate --name Guests --attributes GuestId:string

npx sequelize-cli model:generate --name Products --attributes productName:string,price:string,quantity:string,type:string

npx sequelize-cli model:generate --name Orders --attributes UserId:string,GuestId:string,orderState:string

npx sequelize-cli model:generate --name OrderItems --attributes OrderId:string,ProductId:string,quantity:string,price:string,options:string

npx sequelize-cli model:generate --name Options --attributes ProductId:string,extra_price:string,hot:string,shot_price:string

npx sequelize-cli model:generate --name ProductOrders --attributes quantity:string,ProductId:string,ProductOrderState:string
