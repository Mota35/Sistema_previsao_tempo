# WeatherApp — Fullstack (Angular 17 + PHP)

## Arquitectura Geral

```
┌─────────────────────────────────────────────────────────────┐
│  Angular 17 Frontend (localhost:4200)                        │
│                                                              │
│  AuthModule          DashboardModule         SharedModule    │
│  ├─ LoginComponent   ├─ DashboardHome        ├─ Navbar       │
│  ├─ Register         ├─ WeatherCard (*)      ├─ Alert        │
│  └─ ForgotPassword   ├─ ForecastCard (*)     ├─ Spinner      │
│                      ├─ FavoritesList        ├─ ThemeToggle  │
│  Core Services       ├─ HistoryTable (*)     └─ LangToggle   │
│  ├─ AuthService      ├─ ExportPanel (*)                      │
│  ├─ WeatherService   └─ AdminLogs                            │
│  ├─ FavoritesService                                         │
│  ├─ ExportService    (*) = componente reutilizável           │
│  ├─ ThemeService                                             │
│  └─ I18nService                                              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP + Bearer JWT
                         ▼ proxy → localhost/backend
┌─────────────────────────────────────────────────────────────┐
│  PHP Backend (Apache / localhost)                            │
│                                                              │
│  index.php (Router)                                          │
│  ├─ /auth/*          → AuthController                       │
│  ├─ /cidades-favoritas/* → CidadesFavoritasController        │
│  └─ /weather/*       → WeatherController                    │
│                                                              │
│  Services: WeatherService → OpenWeatherMap API               │
│  Models: PDO → MySQL (weather_app)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuração — Passo a Passo

### 1. Base de Dados

```bash
mysql -u root -p < backend/schema.sql
```

Isso cria a BD `weather_app` com as 3 tabelas e um utilizador admin padrão:
- Email: `admin@weatherapp.com`
- Senha: `admin123`

### 2. Backend PHP

Coloque a pasta `backend/` na raiz do seu servidor Apache (ex: `C:/xampp/htdocs/backend`).

Edite as configurações necessárias:

**`backend/config/database.php`**
```php
private string $host     = 'localhost';
private string $dbname   = 'weather_app';
private string $user     = 'root';
private string $password = '';
```

**`backend/helpers/JWT.php`**
```php
private static string $secret = 'MUDE_ESTA_CHAVE_EM_PRODUCAO_abc123xyz';
```

**`backend/services/WeatherService.php`**
```php
private string $apiKey = 'SUA_CHAVE_OPENWEATHERMAP';
```
> Obtenha uma chave gratuita em: https://openweathermap.org/api

Verifique que o `.htaccess` está activo no Apache:
```apache
# httpd.conf ou .htaccess no VirtualHost
AllowOverride All
```

### 3. Frontend Angular

```bash
cd weather-app
npm install
npm start          # http://localhost:4200
```

O `proxy.conf.json` redireciona `/backend/*` → `http://localhost/backend/*` automaticamente, eliminando problemas de CORS durante o desenvolvimento.

Para **produção**:
```bash
npm run build      # gera dist/weather-app/
```
Coloque o conteúdo de `dist/weather-app/` no servidor web e configure o CORS no backend PHP.

---

## Estrutura de Ficheiros (Frontend)

```
weather-app/src/app/
│
├── core/
│   ├── guards/
│   │   └── auth.guard.ts           # AuthGuard + GuestGuard
│   ├── interceptors/
│   │   └── jwt.interceptor.ts      # Injeta Bearer token em todos os requests
│   ├── models/
│   │   └── models.ts               # Interfaces TypeScript (User, WeatherData, etc.)
│   └── services/
│       ├── auth.service.ts         # Login, register, logout, me()
│       ├── weather.service.ts      # Clima, previsão, histórico
│       ├── favorites.service.ts    # CRUD cidades favoritas
│       ├── export.service.ts       # Exportação CSV e PDF (print)
│       ├── admin.service.ts        # Dados de admin
│       └── theme-i18n.service.ts   # ThemeService + I18nService + traduções PT/EN
│
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login/              # Formulário login reactivo
│   │   │   ├── register/           # Formulário registo com validação
│   │   │   └── forgot-password/    # Recuperação de senha
│   │   ├── auth.module.ts
│   │   └── auth-routing.module.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── dashboard-home/     # Pesquisa + WeatherCard + ForecastGrid
│   │   │   ├── weather-card/       # ★ Componente reutilizável — clima actual
│   │   │   ├── forecast-card/      # ★ Componente reutilizável — card previsão
│   │   │   ├── favorites-list/     # CRUD favoritos com modal
│   │   │   ├── history-table/      # Tabela histórico + filtro + exportar
│   │   │   ├── export-panel/       # ★ Componente reutilizável — botões CSV/PDF
│   │   │   └── admin-logs/         # Vista exclusiva admin — logs globais
│   │   ├── dashboard.module.ts
│   │   └── dashboard-routing.module.ts
│   │
│   └── shared/
│       ├── components/
│       │   ├── navbar/             # Navbar responsiva com menu hamburger
│       │   ├── theme-toggle/       # Botão ☀️/🌙
│       │   ├── lang-toggle/        # Botão PT/EN
│       │   ├── alert/              # Alertas reutilizáveis (success/error/warning/info)
│       │   └── loading-spinner/    # Spinner inline ou overlay
│       ├── pipes/
│       │   └── translate.pipe.ts   # Pipe | translate para i18n
│       └── shared.module.ts
│
├── app.component.ts                # Root: inicializa tema + sessão
├── app.module.ts                   # HTTP_INTERCEPTORS, lazy loading
└── app-routing.module.ts           # /auth → AuthModule, /dashboard → DashboardModule
```

---

## Funcionalidades por Módulo

### AuthModule
| Funcionalidade | Detalhe |
|---|---|
| Login | Reactive Forms + validação + toggle senha |
| Registo | Validação de confirmação de senha |
| Recuperação de senha | Gera token no backend |
| GuestGuard | Redireciona para dashboard se já autenticado |

### DashboardModule
| Funcionalidade | Detalhe |
|---|---|
| Pesquisa de cidade | Por nome ou por GPS (geolocalização) |
| WeatherCard | Temperatura, sensação, humidade, vento, pressão, visibilidade |
| ForecastCard | Previsão próximas 24h (intervalos 3h) |
| Chips de favoritos | Acesso rápido às cidades guardadas |
| Adicionar favorito | Directamente do resultado de pesquisa |
| Histórico | Tabela com filtro em tempo real |
| Exportar CSV | Via `ExportService` (client-side) |
| Exportar PDF | Via `window.print()` em iframe oculto |
| Admin Logs | Tabela de consultas de **todos** os utilizadores (role=admin) |

### SharedModule
| Componente/Pipe | Input/Output |
|---|---|
| `<app-alert>` | `message`, `type`, `(dismiss)` |
| `<app-loading-spinner>` | `loading`, `label`, `inline` |
| `<app-export-panel>` | `(exportCSV)`, `(exportPDF)` |
| `<app-weather-card>` | `data`, `isFavorite`, `(addFavorite)` |
| `<app-forecast-card>` | `item` |
| `translate` pipe | `'chave.tradução' \| translate` |

---

## Dark / Light Mode

O tema é gerido pelo `ThemeService`:
- Persiste em `localStorage` (`wapp_theme`)
- Aplica `data-theme="dark|light"` no `<html>`
- O CSS usa variáveis CSS que mudam conforme o atributo
- O toggle fica visível na Navbar em todas as páginas

## Internacionalização (i18n)

O `I18nService` contém um dicionário inline (`TRANSLATIONS`) para PT e EN.
O `TranslatePipe` (impuro) reflecte mudanças de idioma em tempo real sem refresh.

Para adicionar uma chave nova:
```typescript
// theme-i18n.service.ts → TRANSLATIONS
pt: { 'nova.chave': 'Texto em português' },
en: { 'nova.chave': 'Text in English' },
```
Uso no template: `{{ 'nova.chave' | translate }}`

---

## Níveis de Acesso

| Role | Acesso |
|------|--------|
| `utilizador` | Dashboard, Favoritos, Histórico próprio |
| `admin` | Tudo acima + `/dashboard/admin` (logs de todos os utilizadores) |

O `AuthGuard` verifica `data: { roles: ['admin'] }` na rota.
O backend valida o papel via JWT no `AuthMiddleware`.

---

## Variáveis de Ambiente

**`src/environments/environment.ts`** (desenvolvimento):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200/backend', // via proxy
  openWeatherIconUrl: 'https://openweathermap.org/img/wn',
};
```

**`src/environments/environment.prod.ts`** (produção — criar):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seudominio.com/backend',
  openWeatherIconUrl: 'https://openweathermap.org/img/wn',
};
```
