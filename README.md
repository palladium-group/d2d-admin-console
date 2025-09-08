# D2D Admin Console

The **D2D Admin Console** is a React-based frontend application for managing and administering the [Palladium D2D platform](https://github.com/palladium-group/). It provides a modern, responsive UI built with React and packaged for deployment using **Docker** and **Nginx**.

---

## 🚀 Features

* **React 18 + JavaScript** frontend
* Keycloak authentication (OIDC)
* **Responsive design** optimized for admin workflows
* **Dockerized build** for consistent deployment
* **Nginx static hosting** with support for React Router client-side routing
* Environment-based configuration via `.env` files

---

## 📂 Project Structure

```bash
d2d-admin-console/
│── src/               # Application source code
│── public/            # Static assets
│── build/             # Production build output (generated)
│── nginx.conf         # Custom Nginx config for React Router
│── Dockerfile         # Multi-stage Docker build
│── package.json       # NPM dependencies & scripts
│── .env               # Default environment variables
```

---

## ⚙️ Local Development

1. **Clone the repo**

   ```bash
   git clone https://github.com/palladium-group/d2d-admin-console.git
   cd d2d-admin-console
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add SSL Certificates**
Place your local development SSL certs in a .cert/ folder at the project root:

```bash
.cert/cert.pem
.cert/key.pem
```
🔒 These should not be committed to Git. Add .cert/ to .gitignore.

4. **Run with HTTPS (required for Keycloak)**

   ```bash
   npm start 
   ```

This runs:

```bash
HTTPS=true \
SSL_CRT_FILE=./.cert/cert.pem \
SSL_KEY_FILE=./.cert/key.pem \
react-app-rewired start
```

By default, the app is available at:
👉 https://localhost:3000

Ensure your Keycloak realm allows this redirect URI:

https://localhost:3000/*


5. **Build for production**

   ```bash
   npm run build
   ```

---

## 🐳 Running with Docker

The app is fully dockerized using a multi-stage build (Node → Nginx).

### Build the image

```bash
docker build -t d2d-admin-console .
```

### Run the container

```bash
docker run -d -p 8080:80 --name d2d-admin-console d2d-admin-console
```

Now visit: **[http://localhost:8080](http://localhost:8080)**

---

## ⚡ Environment Variables

The build supports `.env` files.
By default, `.env` is used, but you can override it with `--build-arg`.

Example:

```bash
docker build --build-arg ENV_FILE=.env.staging -t d2d-admin-console .
```

Typical `.env` variables:

```
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

---

## 📑 Nginx Configuration

The `nginx.conf` ensures React Router works correctly by redirecting all routes to `index.html`:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

---

## 🛠️ Useful Commands

* **Stop container**

  ```bash
  docker stop d2d-admin-console
  ```
* **Remove container**

  ```bash
  docker rm d2d-admin-console
  ```
* **View logs**

  ```bash
  docker logs -f d2d-admin-console
  ```

---

## 🤝 Contributing

1. Fork the repo & create a new branch.
2. Make changes & run locally.
3. Submit a Pull Request for review.
