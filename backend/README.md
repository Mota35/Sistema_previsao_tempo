# Weather App – Backend PHP Puro

## Estrutura de Pastas

```
backend/
├── config/
│   └── database.php          # Singleton PDO
├── helpers/
│   ├── JWT.php               # Encode / decode JWT HS256
│   └── Response.php          # json() | success() | error() | csv()
├── middleware/
│   └── AuthMiddleware.php    # Valida Bearer token / role admin
├── models/
│   ├── UtilizadorModel.php
│   ├── CidadeFavoritaModel.php
│   └── HistoricoModel.php
├── services/
│   └── WeatherService.php    # Wrapper OpenWeatherMap API
├── controllers/
│   ├── AuthController.php
│   ├── CidadesFavoritasController.php
│   └── WeatherController.php
├── schema.sql                # DDL completo (criar BD)
├── .htaccess                 # Rewrite rules (Apache)
└── index.php                 # Router principal
```

---

## Configuração

### 1. Base de dados
```bash
mysql -u root -p < schema.sql
```

### 2. Credenciais – `config/database.php`
```php
private string $host     = 'localhost';
private string $dbname   = 'weather_app';
private string $user     = 'root';
private string $password = '';
```

### 3. Chave JWT – `helpers/JWT.php`
```php
private static string $secret = 'MUDE_ESTA_CHAVE_EM_PRODUCAO';
```

### 4. API Key OpenWeatherMap – `services/WeatherService.php`
```php
private string $apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
```
Obtenha em: https://openweathermap.org/api

---

## Endpoints (para configurar no Angular)

### 🔐 Autenticação  `BaseURL/auth`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/auth/register` | ❌ | Cria nova conta → devolve `{ token, utilizador }` |
| `POST` | `/auth/login` | ❌ | Login → devolve `{ token, utilizador }` |
| `POST` | `/auth/logout` | ❌ | Logout (stateless; descarta token no cliente) |
| `GET`  | `/auth/me` | ✅ | Retorna dados do utilizador autenticado |
| `POST` | `/auth/recuperar-senha` | ❌ | Gera token de recuperação; body: `{ email }` |
| `POST` | `/auth/redefinir-senha` | ❌ | Redefine senha; body: `{ token, nova_senha }` |

---

### ⭐ Cidades Favoritas  `BaseURL/cidades-favoritas`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET`    | `/cidades-favoritas` | ✅ | Lista favoritas do utilizador |
| `POST`   | `/cidades-favoritas` | ✅ | Adiciona favorita; body: `{ nome_cidade, pais }` |
| `GET`    | `/cidades-favoritas/{id}` | ✅ | Detalhe de uma cidade |
| `PUT`    | `/cidades-favoritas/{id}` | ✅ | Actualiza cidade; body: `{ nome_cidade, pais }` |
| `DELETE` | `/cidades-favoritas/{id}` | ✅ | Remove favorita |
| `GET`    | `/cidades-favoritas/exportar` | ✅ | Download CSV das favoritas |

---

### 🌤️ Clima  `BaseURL/weather`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET`    | `/weather?cidade=X&pais=AO` | ✅ | Clima actual + grava no histórico |
| `GET`    | `/weather/previsao?cidade=X&pais=AO` | ✅ | Previsão 5 dias (3h/3h) |
| `GET`    | `/weather/coordenadas?lat=X&lon=Y` | ✅ | Clima por coordenadas GPS |
| `GET`    | `/weather/historico` | ✅ | Lista histórico do utilizador |
| `DELETE` | `/weather/historico` | ✅ | Apaga todo o histórico |
| `GET`    | `/weather/historico/exportar` | ✅ | Download CSV do histórico |

---

## Autenticação no Angular

Todos os endpoints marcados com ✅ requerem o header:
```
Authorization: Bearer <JWT_TOKEN>
```

Exemplo de `AuthInterceptor` no Angular:
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next.handle(req);
}
```

---

## Formato de Resposta JSON

```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Erro:
```json
{
  "success": false,
  "message": "Credenciais inválidas.",
  "errors": null
}
```
