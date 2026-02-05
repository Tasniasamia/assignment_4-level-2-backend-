var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import "express";
import cors from "cors";
import "dotenv/config";

// src/middleware/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
};
var notFound_default = notFound;

// generated/prisma/client.ts
import * as process2 from "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/library";

// generated/prisma/enums.ts
var ROLE = {
  customer: "customer",
  provider: "provider",
  admin: "admin"
};
var USERSTATUS = {
  suspend: "suspend",
  activate: "activate"
};
var ORDERSTATUS = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/library";
var config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client"
    },
    "output": {
      "value": "C:\\Users\\Tasnia\\Desktop\\Programming-hero\\Assignment-4\\backend\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\Tasnia\\Desktop\\Programming-hero\\Assignment-4\\backend\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.19.2",
  "engineVersion": "c2990dca591cba766e3b7ef5d9e8a84796e47ab7",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nenum ROLE {\n  customer\n  provider\n  admin\n}\n\nenum USERSTATUS {\n  suspend\n  activate\n}\n\nmodel Categories {\n  id    String @id @default(cuid())\n  name  String // "Italian", "Chinese"\n  meals Meal[]\n\n  @@map("category")\n}\n\nmodel User {\n  id               String            @id\n  name             String\n  email            String\n  emailVerified    Boolean           @default(false)\n  image            String?\n  createdAt        DateTime          @default(now())\n  updatedAt        DateTime          @updatedAt\n  sessions         Session[]\n  accounts         Account[]\n  role             ROLE              @default(customer)\n  status           USERSTATUS        @default(activate)\n  ProviderProfiles ProviderProfiles?\n  reviews          Review[]\n  Meal             Meal[]\n  cart             CartItem[]\n\n  @@unique([email])\n  @@map("users")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel ProviderProfiles {\n  id             String   @id @default(cuid())\n  userId         String   @unique\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  restaurantName String\n  description    String?\n  phone          String\n  address        String\n  openingTime    String // "10:00 AM"\n  closingTime    String // "11:00 PM"\n  isOpen         Boolean  @default(true)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n}\n\nmodel Meal {\n  id                 String     @id @default(cuid())\n  name               String\n  description        String?\n  price              Int\n  image              String?\n  isAvailable        Boolean    @default(true)\n  providerId         String\n  provider           User       @relation(fields: [providerId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  categoryId         String\n  category           Categories @relation(fields: [categoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  dietaryPreferences String\n  rating             Float      @default(0)\n  Cart               CartItem[]\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n  reviews            Review[]\n\n  @@unique([id])\n  @@map("meals")\n}\n\nmodel Review {\n  id        String   @id @default(cuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  mealId    String\n  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  rating    Float    @default(0)\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("reviews")\n}\n\nenum ORDERSTATUS {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id String @id @default(cuid())\n\n  customerId String?\n\n  items CartItem[]\n\n  status          ORDERSTATUS @default(PLACED)\n  totalAmount     Int?\n  deliveryAddress String?\n  paymentMethod   String?     @default("Cash On Delivery")\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  @@map("orders")\n}\n\nmodel CartItem {\n  id         String  @id @default(cuid())\n  userId     String\n  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  mealId     String\n  meal       Meal    @relation(fields: [mealId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  orderId    String?\n  orders     Order?  @relation(fields: [orderId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  isReviewed Boolean @default(false)\n\n  quantity Int\n\n  @@map("cart_items")\n}\n',
  "inlineSchemaHash": "c83e4512b3e6c5b65a2df40a34de80569811e2eed30f97c9354408b4aed7b9d5",
  "copyEngine": true,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "dirname": ""
};
config.runtimeDataModel = JSON.parse('{"models":{"Categories":{"dbName":"category","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"meals","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Meal","nativeType":null,"relationName":"CategoriesToMeal","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"User":{"dbName":"users","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"emailVerified","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"sessions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Session","nativeType":null,"relationName":"SessionToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"accounts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ROLE","nativeType":null,"default":"customer","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"USERSTATUS","nativeType":null,"default":"activate","isGenerated":false,"isUpdatedAt":false},{"name":"ProviderProfiles","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProviderProfiles","nativeType":null,"relationName":"ProviderProfilesToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","nativeType":null,"relationName":"ReviewToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"Meal","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Meal","nativeType":null,"relationName":"MealToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"cart","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","nativeType":null,"relationName":"CartItemToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["email"]],"uniqueIndexes":[{"name":null,"fields":["email"]}],"isGenerated":false},"Session":{"dbName":"session","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"token","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"ipAddress","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userAgent","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"SessionToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["token"]],"uniqueIndexes":[{"name":null,"fields":["token"]}],"isGenerated":false},"Account":{"dbName":"account","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"providerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"AccountToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"accessToken","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"refreshToken","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"idToken","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accessTokenExpiresAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"refreshTokenExpiresAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"scope","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Verification":{"dbName":"verification","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"identifier","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"value","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProviderProfiles":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ProviderProfilesToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","relationOnUpdate":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"restaurantName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"address","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"openingTime","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"closingTime","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isOpen","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Meal":{"dbName":"meals","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isAvailable","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"providerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"provider","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"MealToUser","relationFromFields":["providerId"],"relationToFields":["id"],"relationOnDelete":"Cascade","relationOnUpdate":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"categoryId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Categories","nativeType":null,"relationName":"CategoriesToMeal","relationFromFields":["categoryId"],"relationToFields":["id"],"relationOnDelete":"Cascade","relationOnUpdate":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"dietaryPreferences","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"Cart","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","nativeType":null,"relationName":"CartItemToMeal","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","nativeType":null,"relationName":"MealToReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["id"]],"uniqueIndexes":[{"name":null,"fields":["id"]}],"isGenerated":false},"Review":{"dbName":"reviews","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ReviewToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"mealId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"meal","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Meal","nativeType":null,"relationName":"MealToReview","relationFromFields":["mealId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"comment","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Order":{"dbName":"orders","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"customerId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","nativeType":null,"relationName":"CartItemToOrder","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ORDERSTATUS","nativeType":null,"default":"PLACED","isGenerated":false,"isUpdatedAt":false},{"name":"totalAmount","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"deliveryAddress","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"paymentMethod","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"Cash On Delivery","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"CartItem":{"dbName":"cart_items","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"CartItemToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","relationOnUpdate":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"mealId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"meal","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Meal","nativeType":null,"relationName":"CartItemToMeal","relationFromFields":["mealId"],"relationToFields":["id"],"relationOnDelete":"Cascade","relationOnUpdate":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"orderId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"orders","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","nativeType":null,"relationName":"CartItemToOrder","relationFromFields":["orderId"],"relationToFields":["id"],"relationOnDelete":"Cascade","relationOnUpdate":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"isReviewed","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{"ROLE":{"values":[{"name":"customer","dbName":null},{"name":"provider","dbName":null},{"name":"admin","dbName":null}],"dbName":null},"USERSTATUS":{"values":[{"name":"suspend","dbName":null},{"name":"activate","dbName":null}],"dbName":null},"ORDERSTATUS":{"values":[{"name":"PLACED","dbName":null},{"name":"PREPARING","dbName":null},{"name":"READY","dbName":null},{"name":"DELIVERED","dbName":null},{"name":"CANCELLED","dbName":null}],"dbName":null}},"types":{}}');
config.engineWasm = void 0;
config.compilerWasm = void 0;
function getPrismaClientClass(dirname2) {
  config.dirname = dirname2;
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CategoriesScalarFieldEnum: () => CategoriesScalarFieldEnum,
  DbNull: () => DbNull,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfilesScalarFieldEnum: () => ProviderProfilesScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/library";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "6.19.2",
  engine: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7"
};
var NullTypes = {
  DbNull: runtime2.objectEnumValues.classes.DbNull,
  JsonNull: runtime2.objectEnumValues.classes.JsonNull,
  AnyNull: runtime2.objectEnumValues.classes.AnyNull
};
var DbNull = runtime2.objectEnumValues.instances.DbNull;
var JsonNull = runtime2.objectEnumValues.instances.JsonNull;
var AnyNull = runtime2.objectEnumValues.instances.AnyNull;
var ModelName = {
  Categories: "Categories",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  ProviderProfiles: "ProviderProfiles",
  Meal: "Meal",
  Review: "Review",
  Order: "Order",
  CartItem: "CartItem"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var CategoriesScalarFieldEnum = {
  id: "id",
  name: "name"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfilesScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  description: "description",
  phone: "phone",
  address: "address",
  openingTime: "openingTime",
  closingTime: "closingTime",
  isOpen: "isOpen",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  image: "image",
  isAvailable: "isAvailable",
  providerId: "providerId",
  categoryId: "categoryId",
  dietaryPreferences: "dietaryPreferences",
  rating: "rating",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mealId: "mealId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  status: "status",
  totalAmount: "totalAmount",
  deliveryAddress: "deliveryAddress",
  paymentMethod: "paymentMethod",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mealId: "mealId",
  orderId: "orderId",
  isReviewed: "isReviewed",
  quantity: "quantity"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass(__dirname);
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process2.cwd(), "generated/prisma/query_engine-windows.dll.node");

// src/middleware/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields!";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401, errorMessage = "Authentication failed against database server at {database_host}";
    }
  }
  res.status(statusCode);
  res.json({ message: errorMessage, error: errorDetails });
}
var globalErrorHandler_default = errorHandler;

// src/routes/index.ts
import { Router as Router9 } from "express";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { customSession } from "better-auth/plugins";
var prisma = new PrismaClient();
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sharintasnia1@gmail.com",
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: ["http://localhost:3000"],
  //   session: {
  //     cookieCache: {
  //         enabled: true,
  //         maxAge: 5 * 60 // Cache duration in seconds (5 minutes)
  //     }
  // },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/verification?token=${token}`;
      const htmlTemplate = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <title>Email Verification</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:40px 0;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px;">
                          
                          <tr>
                            <td style="text-align:center;">
                              <h2 style="color:#333;">Verify your email</h2>
                            </td>
                          </tr>
        
                          <tr>
                            <td style="padding:20px 0; color:#555; font-size:15px;">
                              Hi <b>${user.email}</b>, <br/><br/>
                              Thanks for creating an account. Please verify your email address by clicking the button below.
                            </td>
                          </tr>
        
                          <tr>
                            <td align="center" style="padding:20px 0;">
                              <a href="${verificationUrl}"
                                 style="
                                   background:#2563eb;
                                   color:#ffffff;
                                   text-decoration:none;
                                   padding:12px 24px;
                                   border-radius:6px;
                                   font-size:16px;
                                   display:inline-block;
                                 ">
                                Verify Email
                              </a>
                            </td>
                          </tr>
        
                          <tr>
                            <td style="padding-top:20px; font-size:13px; color:#777;">
                              If you didn\u2019t create this account, you can safely ignore this email.
                            </td>
                          </tr>
        
                          <tr>
                            <td style="padding-top:30px; font-size:12px; color:#aaa; text-align:center;">
                              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Your App Name. All rights reserved.
                            </td>
                          </tr>
        
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `;
      await transporter.sendMail({
        from: "<info@foodhub.com>",
        to: user.email,
        subject: "Verify your email address",
        html: htmlTemplate
      });
    },
    cookies: {
      secure: false,
      sameSite: "lax"
    }
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const roles = await prisma.user.findMany({
        where: {
          id: session.userId
        },
        select: {
          role: true
        }
      });
      return {
        user: {
          ...user,
          role: roles[0]?.role
        },
        session
      };
    })
  ]
});

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma2 = new PrismaClient({ adapter });

// src/modules/auth/auth.service.ts
var resister = async (payload) => {
  try {
    const data = await auth.api.signUpEmail({ body: payload });
    if (data?.user?.id) {
      const updateData = await prisma2.user.update({
        where: {
          id: data?.user?.id
        },
        data: {
          role: payload.role
        }
      });
      return {
        success: true,
        data: updateData,
        message: "User Registered Successfully"
      };
    }
    return {
      success: false,
      message: "User Registration Failed",
      data
    };
  } catch (error) {
    return {
      success: false,
      data: JSON.stringify(error),
      message: error?.message
    };
  }
};
var login = async (payload, res) => {
  try {
    const responsedata = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    const data = await responsedata.json();
    const setCookie = responsedata.headers.get("set-cookie");
    if (!data?.code) {
      if (setCookie) {
        res.setHeader("Set-Cookie", setCookie);
      }
      const userdata = await prisma2.user.findUnique({ where: { id: data?.user?.id } });
      return {
        success: true,
        data: { ...userdata },
        message: "Login Successfully"
      };
    }
    return {
      success: false,
      message: data?.code ? data?.message : "Login Failed",
      data
    };
  } catch (error) {
    return {
      success: false,
      data: JSON.stringify(error),
      message: error?.message
    };
  }
};
var getProfile = async (userdata) => {
  const data = await prisma2.user.findUnique({
    where: { id: userdata?.id }
  });
  if (data?.role !== userdata?.role) {
    return {
      success: false,
      message: `You are authenticated as ${data?.role} but try to find your profile ${userdata?.role}
       `,
      data
    };
  }
  if (data?.role === ROLE.provider && userdata?.role === ROLE.provider) {
    const providerdata = await prisma2.providerProfiles.findUnique({
      where: { userId: data?.id }
    });
    return {
      success: true,
      data: { ...data, providerdata }
    };
  }
  if (data) {
    return { success: true, data };
  }
  return {
    success: false,
    message: "User not found",
    data
  };
};
var updateProfile = async (userdata, payload) => {
  if (payload?.id !== userdata?.id) {
    return {
      success: false,
      message: "Payload data and session data are not matched",
      data: userdata
    };
  }
  const data = await prisma2.user.findUnique({
    where: { id: userdata?.id }
  });
  if (data?.role !== userdata?.role) {
    return {
      success: false,
      message: `You are authenticated as ${data?.role} but try to find your profile ${userdata?.role}
       `,
      data
    };
  }
  const updateData = await prisma2.user.update({
    where: { id: payload?.id },
    data: { ...payload }
  });
  if (updateData) {
    return { success: true, message: "profile updated successfully", data: { ...updateData } };
  }
  return {
    success: false,
    message: "User not found",
    data: updateData || null
  };
};
var authService = { resister, login, getProfile, updateProfile };

// src/modules/auth/auth.controller.ts
var resister2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await authService.resister(payload);
    if (result.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var login2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await authService.login(payload, res);
    if (result.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var getProfile2 = async (req, res, next) => {
  try {
    const userdata = await req.user;
    const result = await authService.getProfile(userdata);
    if (result.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var updateProfile2 = async (req, res, next) => {
  try {
    const userdata = await req.user;
    const payload = await req.body;
    const result = await authService.updateProfile(userdata, payload);
    if (result.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var authController = { resister: resister2, login: login2, getProfile: getProfile2, updateProfile: updateProfile2 };

// src/middleware/authHandler.ts
var authHandler = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({ headers: req?.headers });
    if (!session?.session) {
      return res.status(401).json(
        {
          success: false,
          status: 401,
          message: "You are not authorized"
        }
      );
    }
    if (!session?.user?.emailVerified) {
      res.status(403).json({
        success: false,
        message: "Email Verification Required. Please verify your email"
      });
    }
    if (!roles?.length && !roles.includes(req?.user?.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to access this resources"
      });
    }
    req.user = {
      id: session?.user?.id,
      email: session?.user?.email,
      name: session?.user?.name,
      role: session?.user.role,
      emailVerified: session?.user?.emailVerified
    };
    next();
  };
};

// src/modules/auth/auth.route.ts
var route = Router();
route.post("/resister", authController.resister);
route.post("/login", authController.login);
route.get("/me", authHandler(ROLE.admin, ROLE.provider, ROLE.customer), authController.getProfile);
route.put("/profile", authHandler(ROLE.admin, ROLE.provider, ROLE.customer), authController.updateProfile);
var authRoute = route;

// src/modules/provider/provider.route.ts
import { Router as Router2 } from "express";

// src/modules/provider/provider.service.ts
var updateOrCreateProvider = async (payload) => {
  const updateData = await prisma2.providerProfiles.upsert({
    where: { userId: payload.userId },
    update: {
      restaurantName: payload.restaurantName,
      description: payload.description ?? null,
      phone: payload.phone,
      address: payload.address,
      openingTime: payload.openingTime,
      closingTime: payload.closingTime,
      isOpen: payload.isOpen
    },
    create: {
      userId: payload.userId,
      restaurantName: payload.restaurantName,
      description: payload.description ?? null,
      phone: payload.phone,
      address: payload.address,
      openingTime: payload.openingTime,
      closingTime: payload.closingTime,
      isOpen: payload.isOpen
    }
  });
  if (updateData) {
    return {
      success: true,
      data: updateData,
      message: "Provider profile updated or Created Successfully"
    };
  }
  return {
    success: false,
    message: "Provider profile update or Create failed",
    data: null
  };
};
var getProviderProfile = async (id) => {
  const data = await prisma2.providerProfiles.findUnique({
    where: { userId: id }
  });
  if (data) {
    return {
      success: true,
      data: { ...data }
    };
  }
  return {
    success: false,
    message: "provider not found"
  };
};
var providerDashboard = async (id) => {
  const totalOrders = await prisma2.order.aggregate({
    where: {
      items: {
        some: {
          meal: {
            providerId: id
            // 👈 provider id
          }
        }
      }
    },
    _count: {
      id: true
    },
    _sum: {
      totalAmount: true
    }
  });
  const deliveredOrders = await prisma2.order.aggregate({
    where: {
      items: {
        some: {
          meal: {
            providerId: id
            // 👈 provider id
          }
        }
      },
      status: ORDERSTATUS.DELIVERED
    },
    _count: {
      id: true
    },
    _sum: {
      totalAmount: true
    }
  });
  return {
    success: true,
    data: {
      totalOrderCount: totalOrders._count.id,
      totalOrderAmount: totalOrders._sum.totalAmount ?? 0,
      deliveredOrderCount: deliveredOrders._count.id,
      deliveredOrderAmount: deliveredOrders._sum.totalAmount ?? 0
    }
  };
};
var providerService = {
  updateOrCreateProvider,
  getProviderProfile,
  providerDashboard
};

// src/modules/provider/provider.controller.ts
var updateOrCreateProvider2 = async (req, res, next) => {
  try {
    const userdata = await req.user;
    if (userdata?.role !== ROLE.provider) {
      return res.status(400).json({
        success: false,
        message: `Only provider is acceptable`,
        data: userdata
      });
    }
    const data = await req.body;
    const result = await providerService.updateOrCreateProvider({ userId: userdata?.id, ...data });
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var getProviderProfile2 = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const result = await providerService.getProviderProfile(id);
    if (result?.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var providerDashboard2 = async (req, res, next) => {
  try {
    const userData = await req?.user;
    const result = await providerService.providerDashboard(userData?.id);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var providerController = {
  updateOrCreateProvider: updateOrCreateProvider2,
  getProviderProfile: getProviderProfile2,
  providerDashboard: providerDashboard2
};

// src/modules/provider/provider.route.ts
var route2 = Router2();
route2.get("/dashboard", authHandler(ROLE.provider), providerController.providerDashboard);
route2.put("/profile", authHandler(ROLE.provider), providerController.updateOrCreateProvider);
route2.get("/:id", providerController.getProviderProfile);
var providerRoute = route2;

// src/modules/user/user.route.ts
import { Router as Router3 } from "express";

// src/helpers/paginationHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options?.page) || 1;
  const limit = Number(options?.limit) || 8;
  const skip = Number((page - 1) * limit);
  const sortBy = options?.sortBy || "createdAt";
  const sortOrder = options?.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationHelper_default = paginationSortingHelper;

// src/modules/user/user.service.ts
var getAllUser = async (page, limit, skip, search, status) => {
  const anyConditions = [];
  if (search) {
    anyConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (status) {
    anyConditions.push({ status });
  }
  const data = await prisma2.user.findMany({
    skip,
    take: limit,
    where: { AND: anyConditions }
  });
  const total = await prisma2.user.count({
    where: { AND: anyConditions }
  });
  return {
    success: true,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data
  };
};
var updateStatus = async (data) => {
  const findUSER = await prisma2.user.findUnique({ where: { id: data?.id } });
  let status = findUSER?.status;
  let userStatus;
  if (status === USERSTATUS.activate) {
    userStatus = USERSTATUS.suspend;
  } else {
    userStatus = USERSTATUS.activate;
  }
  const updateData = await prisma2.user.update({
    where: { id: data?.id },
    data: { status: userStatus }
  });
  if (updateData) {
    return {
      success: true,
      message: "Status updated successfully",
      data: updateData
    };
  }
  return {
    success: false,
    message: "Status update failed",
    data: updateData
  };
};
var userService = {
  getAllUser,
  updateStatus
};

// src/modules/user/user.controller.ts
var getAllUser2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can oversee the users",
        data: null
      });
    }
    const { search, status } = req.query;
    const querySearch = search || "";
    const queryStatus = status || "";
    const { page, limit, skip } = await paginationHelper_default(req.query);
    const result = await userService.getAllUser(
      page,
      limit,
      skip,
      querySearch,
      queryStatus
    );
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
};
var updateStatus2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can update the user status",
        data: null
      });
    }
    const data = await req.body;
    const result = await userService.updateStatus(data);
    if (result.success) {
      return res.status(201).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
};
var userController = {
  getAllUser: getAllUser2,
  updateStatus: updateStatus2
};

// src/modules/user/user.route.ts
var route3 = Router3();
route3.get("/admin", authHandler(ROLE.admin), userController.getAllUser);
route3.put("/update-status", authHandler(ROLE.admin), userController.updateStatus);
var userRoute = route3;

// src/modules/meals/category/meals.category.route.ts
import { Router as Router4 } from "express";

// src/modules/meals/category/meals.category.service.ts
var addCategory = async (data) => {
  const insertdata = await prisma2.categories.create({ data });
  if (insertdata?.id) {
    return {
      success: true,
      message: "Category Created Successfully",
      data: insertdata
    };
  }
  return {
    success: false,
    message: "Failed to create category",
    data: insertdata
  };
};
var updateCategory = async (id, data) => {
  const findCategory = await prisma2.categories.findUnique({ where: { id } });
  if (findCategory) {
    const updateData = await prisma2.categories.update({ where: { id }, data: { name: data?.name } });
    return {
      success: true,
      message: "Category updated successfully",
      data: updateData
    };
  }
  return {
    success: false,
    message: "Failed to update category",
    data: null
  };
};
var deleteCategory = async (id) => {
  const findCategory = await prisma2.categories.findUnique({ where: { id } });
  if (findCategory) {
    const deleteData = await prisma2.categories.delete({ where: { id } });
    return {
      success: true,
      message: "Category deleted successfully",
      data: deleteData
    };
  }
  return {
    success: false,
    message: "Failed to delete category",
    data: null
  };
};
var getAllCategory = async () => {
  const findCategoryAll = await prisma2.categories.findMany({});
  return {
    success: true,
    data: findCategoryAll
  };
};
var mealsCategoryService = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory
};

// src/modules/meals/category/meals.category.controller.ts
var addCategory2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can add the category",
        data: null
      });
    }
    const data = await req.body;
    const result = await mealsCategoryService.addCategory(data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can update the category",
        data: null
      });
    }
    const { id } = await req.params;
    const payload = await req.body;
    const result = await mealsCategoryService.updateCategory(
      id,
      payload
    );
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can delete the category",
        data: null
      });
    }
    const { id } = await req.params;
    const result = await mealsCategoryService.deleteCategory(id);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var getAllCategory2 = async (req, res, next) => {
  try {
    const result = await mealsCategoryService.getAllCategory();
    if (result?.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var mealsCategoryController = {
  addCategory: addCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getAllCategory: getAllCategory2
};

// src/modules/meals/category/meals.category.route.ts
var route4 = Router4();
route4.post("/", authHandler(ROLE.admin), mealsCategoryController.addCategory);
route4.put("/:id", authHandler(ROLE.admin), mealsCategoryController.updateCategory);
route4.delete("/:id", authHandler(ROLE.admin), mealsCategoryController.deleteCategory);
route4.get("/", mealsCategoryController.getAllCategory);
var mealsCategoryRoute = route4;

// src/modules/meals/meals.route.ts
import { Router as Router5 } from "express";

// src/modules/meals/meals.service.ts
var addMeal = async (data) => {
  const insertdata = await prisma2.meal.create({ data });
  if (insertdata?.id) {
    return {
      success: true,
      message: "Meat added Successfully",
      data: insertdata
    };
  }
  return {
    success: false,
    message: "Failed to add meal",
    data: insertdata
  };
};
var updateMeal = async (id, data) => {
  const findCategory = await prisma2.meal.findUnique({ where: { id } });
  if (findCategory) {
    const updateData = await prisma2.meal.update({
      where: { id },
      data: { ...data }
    });
    return {
      success: true,
      message: "Meal updated successfully",
      data: updateData
    };
  }
  return {
    success: false,
    message: "Failed to update meal",
    data: null
  };
};
var deleteMeal = async (id) => {
  const findCategory = await prisma2.meal.findUnique({ where: { id } });
  if (findCategory) {
    const deleteData = await prisma2.meal.delete({ where: { id } });
    return {
      success: true,
      message: "Meal deleted successfully",
      data: deleteData
    };
  }
  return {
    success: false,
    message: "Failed to delete meal",
    data: null
  };
};
var getAllMeal = async (category, dietaryPreference, priceNumber, page, limit, skip) => {
  const anyConditions = [];
  if (category || dietaryPreference) {
    anyConditions.push({
      OR: [
        {
          categoryId: {
            contains: category,
            mode: "insensitive"
          }
        },
        {
          dietaryPreferences: {
            contains: dietaryPreference,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (priceNumber) {
    anyConditions.push({ price: priceNumber });
  }
  anyConditions.push({ isAvailable: true });
  const data = await prisma2.meal.findMany({
    skip,
    take: limit,
    where: { AND: anyConditions },
    include: {
      provider: {
        include: {
          ProviderProfiles: true
        }
      },
      category: true,
      reviews: true
    }
  });
  const total = await prisma2.meal.count({
    where: { AND: anyConditions }
  });
  return {
    success: true,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data
  };
};
var getAllMealProvider = async (category, dietaryPreference, priceNumber, page, limit, skip, user) => {
  const anyConditions = [];
  anyConditions.push({ providerId: user?.id });
  if (category != "all" || dietaryPreference) {
    anyConditions.push({
      OR: [
        {
          categoryId: {
            contains: category,
            mode: "insensitive"
          }
        },
        {
          dietaryPreferences: {
            contains: dietaryPreference,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (priceNumber) {
    anyConditions.push({ price: priceNumber });
  }
  const data = await prisma2.meal.findMany({
    skip,
    take: limit,
    where: { AND: anyConditions },
    include: {
      provider: {
        include: {
          ProviderProfiles: true
        }
      },
      category: true,
      reviews: true
    }
  });
  const total = await prisma2.meal.count({
    where: { AND: anyConditions }
  });
  return {
    success: true,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data
  };
};
var getMealById = async (id) => {
  const data = await prisma2.meal.findUnique({
    where: { id },
    include: {
      provider: {
        include: {
          ProviderProfiles: true
        }
      },
      category: true,
      reviews: { include: { user: true } }
    }
  });
  if (data?.id) {
    return { success: true, data };
  }
  return { success: false, data: null };
};
var mealsService = {
  addMeal,
  updateMeal,
  deleteMeal,
  getAllMeal,
  getAllMealProvider,
  getMealById
};

// src/modules/meals/meals.controller.ts
var addMeal2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.provider) {
      return res.status(400).json({
        success: false,
        messsage: "Only provider can add the meal",
        data: null
      });
    }
    const data = await req.body;
    const result = await mealsService.addMeal(data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var updateMeal2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.provider) {
      return res.status(400).json({
        success: false,
        messsage: "Only provider can update the meal",
        data: null
      });
    }
    const { id } = await req.params;
    const data = await req.body;
    const result = await mealsService.updateMeal(id, data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var deleteMeal2 = async (req, res, next) => {
  try {
    if (req.user?.role !== ROLE.provider) {
      return res.status(400).json({
        success: false,
        messsage: "Only provider can delete the meal",
        data: null
      });
    }
    const { id } = await req.params;
    const result = await mealsService.deleteMeal(id);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var getAllMeal2 = async (req, res, next) => {
  try {
    const { categoryId, dietaryPreferences, price } = req?.query;
    const category = typeof categoryId === "string" ? categoryId : void 0;
    const dietaryPreference = dietaryPreferences;
    const priceNumber = Number(price);
    const { page, limit, skip } = paginationHelper_default(req.query);
    const result = await mealsService.getAllMeal(
      category,
      dietaryPreference,
      priceNumber,
      page,
      limit,
      skip
    );
    if (result?.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var getAllMealProvider2 = async (req, res, next) => {
  try {
    if (req?.user?.role !== ROLE.provider) {
      return next({
        success: false,
        message: "Only provider is acceptable",
        data: null
      });
    }
    const userdata = await req?.user;
    const { categoryId, dietaryPreferences, price } = req?.query;
    const category = typeof categoryId === "string" ? categoryId : "all";
    const dietaryPreference = dietaryPreferences;
    const priceNumber = Number(price);
    const { page, limit, skip } = paginationHelper_default(req.query);
    const result = await mealsService.getAllMealProvider(
      category,
      dietaryPreference,
      priceNumber,
      page,
      limit,
      skip,
      userdata
    );
    if (result?.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var getMealById2 = async (req, res, next) => {
  try {
    const { id } = req?.params;
    const result = await mealsService.getMealById(id);
    if (result?.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
var mealController = {
  addMeal: addMeal2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2,
  getAllMeal: getAllMeal2,
  getAllMealProvider: getAllMealProvider2,
  getMealById: getMealById2
};

// src/modules/meals/meals.route.ts
var route5 = Router5();
route5.post("/", authHandler(ROLE.provider), mealController.addMeal);
route5.put("/:id", authHandler(ROLE.provider), mealController.updateMeal);
route5.delete("/:id", authHandler(ROLE.provider), mealController.deleteMeal);
route5.get("/", mealController.getAllMeal);
route5.get("/provider", authHandler(ROLE.provider), mealController.getAllMealProvider);
route5.get("/:id", mealController.getMealById);
var mealRoute = route5;

// src/modules/cart/cart.route.ts
import { Router as Router6 } from "express";

// src/modules/cart/cart.service.ts
var addCart = async (data) => {
  const addCartItem = await prisma2.cartItem.create({ data });
  if (addCartItem?.id) {
    return {
      success: true,
      data: addCartItem,
      message: "Item added into cart successfully"
    };
  }
  return {
    success: false,
    data: addCartItem,
    message: "Failed to add item into cart"
  };
};
var editCart = async (CartId, data) => {
  const existItemIntoCart = await prisma2.cartItem.findUnique({
    where: { id: CartId }
  });
  if (existItemIntoCart?.id) {
    const newQuantity = existItemIntoCart.quantity + data?.quantity;
    const { quantity, ...rest } = existItemIntoCart;
    const updateCart = await prisma2.cartItem.update({
      where: { id: CartId, orderId: null },
      data: { quantity: data?.quantity, ...rest }
    });
    if (updateCart?.id) {
      return {
        success: true,
        message: "Cart Data Updated Successfully",
        data: updateCart
      };
    }
  }
  return {
    success: false,
    message: "Cart data update failed",
    data: null
  };
};
var deleteCart = async (cartId) => {
  const deleteCart3 = await prisma2.cartItem.delete({
    where: { id: cartId }
  });
  if (deleteCart3?.id) {
    return {
      success: true,
      message: "Cart deleted successfully",
      data: deleteCart3
    };
  }
  return {
    success: false,
    message: "Cart deleted failed",
    data: deleteCart3
  };
};
var getCart = async (userId) => {
  const getCartData = await prisma2.cartItem.findMany({ where: { userId, orderId: null }, include: { user: true, meal: true } });
  return {
    success: true,
    data: getCartData
  };
};
var cartService = { addCart, editCart, deleteCart, getCart };

// src/modules/cart/cart.controller.ts
var addCart2 = async (req, res, next) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
      return next({
        success: false,
        message: "Only customer can add item into cart",
        data: null
      });
    }
    const data = await req.body;
    const result = await cartService.addCart(data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var editCart2 = async (req, res, next) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
      return next({
        success: false,
        message: "Only customer can edit item into cart",
        data: null
      });
    }
    const data = await req.body;
    const { id } = await req.params;
    const result = await cartService.editCart(id, data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var deleteCart2 = async (req, res, next) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
      return next({
        success: false,
        message: "Only customer can delete cart item",
        data: null
      });
    }
    const { id } = await req.params;
    const result = await cartService.deleteCart(id);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var getCart2 = async (req, res, next) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
      return next({
        success: false,
        message: "You have to be a customer",
        data: null
      });
    }
    const result = await cartService.getCart(req?.user?.id);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var cartController = { addCart: addCart2, editCart: editCart2, deleteCart: deleteCart2, getCart: getCart2 };

// src/modules/cart/cart.route.ts
var route6 = Router6();
route6.post("/", authHandler(ROLE.customer), cartController.addCart);
route6.put("/:id", authHandler(ROLE.customer), cartController.editCart);
route6.delete("/:id", authHandler(ROLE.customer), cartController.deleteCart);
route6.get("/", authHandler(ROLE.customer), cartController.getCart);
var cartRoute = route6;

// src/modules/order/order.route.ts
import { Router as Router7 } from "express";

// src/modules/order/order.service.ts
var createOrder = async ({ userId, deliveryAddress }) => {
  return await prisma2.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId,
        orderId: null
      },
      include: {
        meal: true
      }
    });
    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.meal.price * item.quantity;
    }, 0);
    const order = await tx.order.create({
      data: {
        customerId: userId,
        deliveryAddress,
        totalAmount,
        status: ORDERSTATUS.PLACED
      }
    });
    await tx.cartItem.updateMany({
      where: {
        userId,
        orderId: null
      },
      data: {
        orderId: order.id
      }
    });
    if (order) {
      return {
        success: true,
        data: order,
        message: "Order has been placed"
      };
    }
    return {
      success: null,
      data: null,
      message: "Order placed failed"
    };
  });
};
var getOrder = async (page, limit, skip, sortBy, sortOrder, user) => {
  let findData, total;
  if (user?.role === ROLE.customer) {
    findData = await prisma2.order.findMany({
      skip,
      take: limit,
      orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      where: { customerId: user?.id },
      include: {
        items: {
          include: {
            meal: {
              include: { provider: { include: { ProviderProfiles: true } } }
            }
          }
        }
      }
    });
    total = await prisma2.order.count({
      where: { customerId: user?.id }
    });
  } else if (user?.role === ROLE.provider) {
    findData = await prisma2.order.findMany({
      skip,
      take: limit,
      orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      where: {
        items: {
          some: {
            meal: {
              providerId: user.id
            }
          }
        }
      },
      include: {
        items: {
          where: {
            meal: {
              providerId: user.id
            }
          },
          include: {
            meal: {
              include: {
                provider: {
                  include: {
                    ProviderProfiles: true
                  }
                }
              }
            }
          }
        }
      }
    });
    total = await prisma2.order.count({
      where: {
        items: {
          some: {
            meal: { providerId: user.id }
          }
        }
      }
    });
  } else if (user?.role === ROLE.admin) {
    findData = await prisma2.order.findMany({
      skip,
      take: limit,
      orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      include: {
        items: {
          include: {
            meal: {
              include: { provider: { include: { ProviderProfiles: true } } }
            }
          }
        }
      }
    });
    total = await prisma2.order.count({});
  }
  if (findData) {
    return {
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: total && Math.ceil(total / limit)
      },
      data: findData
    };
  }
  return {
    success: false,
    data: null
  };
};
var updateOrder = async (id, authenticator, data) => {
  let findOrder;
  if (authenticator?.role === ROLE.customer) {
    findOrder = await prisma2.order.findFirst({
      where: { id, customerId: authenticator?.id }
    });
    if (!findOrder || data?.status != ORDERSTATUS.CANCELLED) {
      return {
        success: false,
        message: !findOrder ? "Order not found" : "Customer can only cancelled the order",
        data: null
      };
    }
  } else if (authenticator?.role === ROLE.provider) {
    findOrder = await prisma2.order.findFirst({
      where: {
        id,
        items: {
          some: {
            meal: {
              providerId: authenticator.id
            }
          }
        }
      }
    });
    if (!findOrder || !["PREPARING", "READY", "DELIVERED"].includes(data.status)) {
      return {
        success: false,
        message: !findOrder ? "Order not found" : "Provider can only set status to Preparing, Ready, or Delivered",
        data: null
      };
    }
  }
  const status = ORDERSTATUS[data.status];
  const updateData = await prisma2.order.update({
    where: { id },
    data: { status }
  });
  if (updateData) {
    return {
      success: true,
      data: updateData,
      message: "Order Status updated successfully"
    };
  }
  return {
    success: false,
    data: null,
    message: "Order Status update failed"
  };
};
var getSingleOrder = async (id) => {
  const findOrder = await prisma2.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          meal: {
            include: { provider: { include: { ProviderProfiles: true } } }
          }
        }
      }
    }
  });
  if (findOrder) {
    const userdata = await prisma2.user.findUnique({ where: { id: findOrder?.customerId } });
    return { success: true, data: { ...findOrder, userdata } };
  }
  return {
    success: false,
    data: null
  };
};
var deleteOrder = async (id) => {
  const deleteOrder3 = await prisma2.order.delete({ where: { id } });
  if (deleteOrder3) {
    return { success: true, data: deleteOrder3, message: "Order deleted successfully" };
  }
  return {
    success: false,
    data: null,
    message: "Order deletion failed"
  };
};
var orderService = {
  createOrder,
  getOrder,
  updateOrder,
  getSingleOrder,
  deleteOrder
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
      return next({
        success: false,
        message: "Only customer can placed order",
        data: null
      });
    }
    const data = await req.body;
    const result = await orderService.createOrder(data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var getOrder2 = async (req, res, next) => {
  try {
    if (!req?.user?.role) {
      return next({
        success: false,
        message: "Unauthorized User",
        data: null
      });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_default(req.query);
    const result = await orderService.getOrder(
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      req?.user
    );
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var updateOrder2 = async (req, res, next) => {
  try {
    const { id } = await req?.params;
    const data = await req?.body;
    const result = await orderService.updateOrder(id, req?.user, data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var getSingleOrder2 = async (req, res, next) => {
  try {
    const { id } = await req?.params;
    const result = await orderService.getSingleOrder(id);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var deleteOrder2 = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const result = await orderService.deleteOrder(id);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    return next(error);
  }
};
var orderController = { createOrder: createOrder2, getOrder: getOrder2, updateOrder: updateOrder2, getSingleOrder: getSingleOrder2, deleteOrder: deleteOrder2 };

// src/modules/order/order.route.ts
var route7 = Router7();
route7.post("/", authHandler(ROLE.customer), orderController.createOrder);
route7.get("/", authHandler(ROLE.admin, ROLE.customer, ROLE.provider), orderController.getOrder);
route7.put("/:id", authHandler(ROLE.customer, ROLE.provider), orderController.updateOrder);
route7.get("/:id", authHandler(ROLE.admin, ROLE.customer, ROLE.provider), orderController.getSingleOrder);
route7.delete("/:id", authHandler(ROLE.admin, ROLE.customer, ROLE.provider), orderController.deleteOrder);
var orderRoute = route7;

// src/modules/review/review.route.ts
import { Router as Router8 } from "express";

// src/modules/review/review.service.ts
var addReview = async (user, payload) => {
  const findOrder = await prisma2.order.findFirst({
    where: {
      id: payload?.orderId,
      customerId: user?.id,
      status: ORDERSTATUS.DELIVERED
    }
  });
  if (!findOrder) {
    return { success: false, message: "Order not found to review", data: null };
  }
  const alreadyReviewed = await prisma2.cartItem.findFirst({
    where: {
      orderId: payload?.orderId,
      mealId: payload?.mealId,
      isReviewed: true,
      userId: payload?.userId
    }
  });
  if (alreadyReviewed) {
    return {
      success: false,
      data: null,
      message: "Already reviewed"
    };
  }
  const findMeal = await prisma2.order.findFirst({
    where: { customerId: user?.id, status: ORDERSTATUS.DELIVERED },
    include: { items: { where: { mealId: payload.mealId } } }
  });
  if (!findMeal) {
    return { success: false, message: "Meal not found to review", data: null };
  }
  console.log("review payload", payload);
  const addReviewData = await prisma2.review.create({ data: { userId: payload?.userId, mealId: payload?.mealId, rating: payload?.rating, comment: payload?.comment } });
  console.log("addReviewData", addReviewData);
  if (addReviewData) {
    const result = await prisma2.review.aggregate({
      where: { mealId: payload?.mealId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    const avgRating = result._avg.rating ?? 0;
    const displayRating = Number(avgRating.toFixed(1));
    if (displayRating) {
      const updateRating = await prisma2.meal.update({
        where: { id: payload.mealId },
        data: { rating: displayRating }
      });
      if (updateRating) {
        const findCart = await prisma2.cartItem.findFirst({ where: { orderId: payload?.mealId, mealId: payload?.mealId } });
        if (findCart) {
          await prisma2.cartItem.update({
            where: { id: findCart?.id },
            data: { isReviewed: true }
          });
        }
        return {
          success: true,
          messages: "add reviewed successfully",
          data: addReviewData
        };
      }
    }
  }
  return {
    success: false,
    message: "Failed to add review",
    data: null
  };
};
var editReview = async (id, user, payload) => {
  const findOrder = await prisma2.order.findFirst({
    where: { customerId: user?.id, status: ORDERSTATUS.DELIVERED }
  });
  if (!findOrder) {
    return { success: false, message: "Order not found to review", data: null };
  }
  const findMeal = await prisma2.order.findFirst({
    where: { customerId: user?.id, status: ORDERSTATUS.DELIVERED },
    include: { items: { where: { mealId: payload.mealId } } }
  });
  if (!findMeal) {
    return { success: false, message: "Meal not found to review", data: null };
  }
  const addReviewData = await prisma2.review.update({
    where: { id },
    data: payload
  });
  if (addReviewData) {
    const result = await prisma2.review.aggregate({
      where: { mealId: payload?.mealId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    const avgRating = result._avg.rating ?? 0;
    const displayRating = Number(avgRating.toFixed(1));
    if (displayRating) {
      const updateRating = await prisma2.meal.update({
        where: { id: payload.mealId },
        data: { rating: displayRating }
      });
      if (updateRating) {
        return {
          success: true,
          messages: "add reviewed successfully",
          data: addReviewData
        };
      }
    }
  }
  return {
    success: false,
    message: "Failed to add review",
    data: null
  };
};
var getAllReview = async (mealId) => {
  const findAllReview = await prisma2.review.findMany({
    where: { mealId }
  });
  return { success: true, data: findAllReview };
};
var deleteReview = async (id, user) => {
  const findReview = await prisma2.review.findFirst({
    where: { id, userId: user?.id }
  });
  if (findReview) {
    const deleteReview3 = await prisma2.review.delete({ where: { id } });
    if (deleteReview3) {
      return {
        success: true,
        message: "Review deleted successfully",
        data: deleteReview3
      };
    }
  }
  return {
    success: false,
    message: "Failed to delete review",
    data: null
  };
};
var reviewService = {
  addReview,
  editReview,
  getAllReview,
  deleteReview
};

// src/modules/review/review.controller.ts
var addReview2 = async (req, res, next) => {
  try {
    const payloadData = await req.body;
    const result = await reviewService.addReview(req?.user, payloadData);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var editReview2 = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const payload = await req.body;
    const result = await reviewService.editReview(id, req?.user, payload);
    if (result?.success) {
      return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var getReview = async (req, res, next) => {
  try {
    const { mealId } = await req.params;
    const result = await reviewService.getAllReview(mealId);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const result = await reviewService.deleteReview(id, req.user);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
var reviewController = {
  addReview: addReview2,
  editReview: editReview2,
  getReview,
  deleteReview: deleteReview2
};

// src/modules/review/review.route.ts
var route8 = Router8();
route8.post("/", authHandler(ROLE.customer), reviewController.addReview);
route8.put("/:id", authHandler(ROLE.customer), reviewController.editReview);
route8.get("/:mealId", reviewController.getReview);
route8.delete("/:id", authHandler(ROLE.customer), reviewController.deleteReview);
var reviewRoute = route8;

// src/routes/index.ts
var route9 = Router9();
var allRoutes = [
  {
    path: "/auth",
    handler: authRoute
  },
  {
    path: "/providers",
    handler: providerRoute
  },
  {
    path: "/user",
    handler: userRoute
  },
  {
    path: "/meals/category",
    handler: mealsCategoryRoute
  },
  {
    path: "/meals",
    handler: mealRoute
  },
  {
    path: "/cart",
    handler: cartRoute
  },
  {
    path: "/order",
    handler: orderRoute
  },
  {
    path: "/review",
    handler: reviewRoute
  }
];
allRoutes.forEach((i) => route9.use(i?.path, i?.handler));
var routes_default = route9;

// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use("/api", routes_default);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(notFound_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
