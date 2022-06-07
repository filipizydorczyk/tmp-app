# Docker build

This project is built as docker image. To do it you can run `npm run build`. It will produce two images (`tmp-app-frontend` and `tmp-app-backend`). These two images will work together without extra configuration assuming that you expose prorts `1338` for frontend and `1337` for backend.

If you want to provide extra configuration you can create docker compose like this one

```yaml
version: "3.2"
services:
    frontend:
        image: tmp-app-frontend:latest
        ports:
            - 1338:80
        volumes:
            # This file needs to be created before you compose container
            - ./runtime-env.js:/usr/share/nginx/html/runtime-env.js

    backend:
        image: tmp-app-backend:latest
        ports:
            - 1337:8080
        volumes:
            - ./data:/data/
        # environment:
        # ACCESS_TOKEN_SECRET: dasda
        # REFRESH_TOKEN_SECRET: asfsdfsd
```

For backend if you will mount `data` volumen you cat find there `database.db` which you can copy as your ultimate backend backup. You can also define envs `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` but I dont think there is a reason to do so.

For frontend you need to be able to define backend endpoint. You can do this by mounting `/usr/share/nginx/html/runtime-env.js` file. Its important to create this file before running container. Content of the file should look like this

```js
window.__RUNTIME_CONFIG__ = {
    NODE_ENV: "production",
    API_URL: "http://localhost:1337/api/v1",
};
```
