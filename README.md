# Projeto Conectados pela Fé

Projeto fullstack com **backend em Laravel** e **frontend em React + Vite**.

---

## Tecnologias

- **Backend:** Laravel 10, PHP 8.0.30, MySQL  
- **Frontend:** React 18 + Vite, Yarn  
- **Servidor local:** XAMPP (Apache + MySQL)

---

## Estrutura do projeto

### 1️⃣ Entrar na pasta e instalar dependências

```bash
cd backend
composer 

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=testemunho
DB_USERNAME=root
DB_PASSWORD=

php artisan key:generate
php artisan migrate

php artisan serve


#entrar nas dependencias
cd meu-frontend

#instalar as dependencias
yarn install

# Inicia o servidor de desenvolvimento Vite
yarn dev

# Para build de produção
yarn build

