# DOCUMENT TRACK BE

## Technologies

-   Adonis V6
-   PostgreSQl
-   Typescript

## How to use

-   Clone this repo
-   copy .env.example to .env
-   Run command: `npm install`
-   Run command: `node ace generate:key`. This command will replace AP_KEY value in .env file.

## Features

-   Login
-   Registration
-   Email verification
-   Middleware for email verified users only
-   Forgot password
-   Reset password
-   MJML for mail templates

## Deploy script

```
cd /path/to/your/project/folder

git pull origin main
# Laravel Forge Users: git pull origin $FORGE_SITE_BRANCH

npm install --no-save

npm run build

node ace migration:run --force --disable-locks
```
