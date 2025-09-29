# Trullo - REST API (NoSQL / MongoDB)

Ett enklet projkethanterings-API byggt med Node.js, Exppress och TypeScript. Databasen är MongoDB (vis Mongoose). API-et hanterar **User** och **Task** med CRUD, validering och seed-data.

## Teoretiska resonemang

### 1) Motivering av databasval (NoSQL / MongoDB)

- **Flexibilitet i schema**: utvecklingen går fort, och Task/User kan ändras över tid. MongoDBs dokumentmodell (JSON-lik) gör iteration smidig.
- **Enkelt att modellera**: Task innehåller fält som `status`, `assignedTo` och tidsstämplar – passar väl som dokument.
- **Validering i applikationslagret**: med Zod + Mongoose kan vi validera och få tydliga 400-fel.
- **Trade-offs**: SQL (t.ex. Postgres + Prisma) hade gett starka relationer, migrations och native enum. NoSQL kräver att vi **själva** säkerställer referenser (t.ex. `assignedTo` pekar på befintlig User). För den här uppgiften väger utvecklingstempo/flexibilitet tyngre.

---
> **När SQL vore bättre**: starka ACID-krav, många JOINs, avancerad rapportering, eller hård dataintegritet.
---
> **När NoSQL lyser**: snabba iterationer, flexibla scheman, dokumentcentrerat flöde.

### 2) Tekniker och vad de gör

- **Node.js / Express**: HTTP-server och routing (`/api/users`, `/api/tasks`).
- **TypeScript**: starkare typer, lättare refactoring, färre klassiska JS-buggar.
- **Mongoose**: ODM mot MongoDB. Scheman, enum-validering, `unique: true` på email, m.m.
- **Zod**: **runtime-validering** av request-body. Fångar fel innan DB (t.ex. felaktig `status` → 400).
- **bcrypt**: lösenord **hashas** med salt innan skrivning (aldrig klartext).
- **dotenv**: laddar variabler från `.env`.
- **cors**: tillåter CORS i dev.
- **morgan**: enkel request-loggning.
- **helmet** (valfritt): säkra HTTP-headers (lätt att lägga på i prod).
- **tsx**: snabb dev-körning av TS (utan separat build steg).
- **Projektupplägg**: `routes → controllers → services → models`, plus
  **`schemas` (Zod)** för indata, **`types/api.ts` (DTO)** + **`utils/mappers.ts`** för rena API-svar.

### 3) Översiktligt hur applikationen fungerar

1. **Request** kommer in till en **route** (`/api/tasks`).
2. **Middleware** kör: `express.json()` parsar JSON, `validateBody(ZodSchema)` validerar indata.
3. **Controller** anropar **Service**.
4. **Service** kör affärslogik:
   - `assignedTo` måste peka på en befintlig user (annars 400).
   - Om `status` sätts till `"done"` → sätt `finishedAt = now`; annars `finishedAt = null`.
   - Vid skapande/uppdatering av User → hash lösenord (`bcrypt`).
5. **Model (Mongoose)** persisterar till MongoDB.
6. **Svar** mappas till DTO via `utils/mappers.ts` (*aldrig* Mongoose-internals eller `password` i svaret).
7. **Felhantering**: 400 (ogiltig input), 404 (saknas), 409 (unikhetskonflikt, t.ex. email), 500 (oväntat).

## Projektstruktur (kort)

- src/
- app.ts, server.ts, config/db.ts
- middleware/ (validate.ts, error.ts)
- models/ (User.ts, Task.ts)
- routes/ (userRoutes.ts, taskRoutes.ts)
- controllers/ (userController.ts, taskController.ts)
- services/ (userService.ts, taskService.ts)
- schemas/ (user.schema.ts, task.schema.ts)
- types/ (api.ts)
- utils/ (mappers.ts)
- seeds/ (seed.ts)

## Körguide

```
### 1) Krav
- Node 18+
- MongoDB (lokalt **eller** Atlas).
  Exempel: Atlas-URI i `.env`.

### 2) Installera
```bash
npm install
npm run dev
npm run seed

# No .env needed

-----------------------------------------
# Start local MongoDB via Docker
docker compose up -d

# Start API (will auto-fallback to mongodb://127.0.0.1:27017/trullo)
npm run dev

# Seed data
npm run seed
```

## Miljövariabler

MONGODB_URI (lokal: mongodb://127.0.0.1:27017/trullo eller Atlas-SRV)

BCRYPT_SALT_ROUNDS=10

PORT=4000 (default)

## Exempel-anrop (cURL)

```
# Skapa user

curl --json '{"name":"Jane","email":"jane@example.com","password":"Passw0rd!"}' \
  http://localhost:4000/api/users


# Skapa task (byt USER_ID)

curl --json '{"title":"Draft brief","assignedTo":"USER_ID","status":"to-do"}' \
  http://localhost:4000/api/tasks


# Lista / Filtrera

curl http://localhost:4000/api/tasks
curl "http://localhost:4000/api/tasks?status=to-do"
curl "http://localhost:4000/api/tasks?assignedTo=USER_ID"


# Uppdatera status -> finishedAt sätts/rensas

curl -X PUT --json '{"status":"done"}' http://localhost:4000/api/tasks/TASK_ID
curl -X PUT --json '{"status":"blocked"}' http://localhost:4000/api/tasks/TASK_ID

```

# API – snabbreferens

## Users

- POST /api/users – skapa (validering: name/email/password)

- GET /api/users – lista

- GET /api/users/:id – hämta en

- PUT /api/users/:id – uppdatera (hashar password om skickat)

- DELETE /api/users/:id – ta bort

## Tasks

- POST /api/tasks – skapa (validering: title, optional description/status/assignedTo)

- GET /api/tasks – lista (filter: status, assignedTo)

- GET /api/tasks/:id – hämta en

- PUT /api/tasks/:id – uppdatera (inkl. status-logik för finishedAt)

- DELETE /api/tasks/:id – ta bort

## Felhantering (exempel)

- 400: ogiltig body/ID/status (Zod/Mongoose ValidationError)

- 404: resurs saknas

- 409: unikhetskonflikt (t.ex. e-post finns redan)

- 500: oväntat fel

<hr>
<hr>

Happy Coder :)

<hr>
<hr>
<hr>
<hr>
<hr>
<hr>

# Uppgiftens krav från lärare

## Mål

Målet är att skapa ett REST-API för en projekthanterings-applikation vid namn Trullo. API\:et ska möjliggöra att användare (User) kan skapa uppgifter (Task) och planera projekt. Databasen ska vara antingen SQL eller NoSQL.

### Teoretiska resonemang

- Motivera ditt val av databas
- Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen
- Redogör översiktligt hur applikationen fungerar

### Krav för Godkänt

- REST-API\:et använder **Node.js, Express och TypeScript**
- **SQL- eller NoSQL-databas**
  - Om SQL → använd t.ex. Prisma med migrationer. Om NoSQL (MongoDB & Mongoose) → definiera relevanta scheman och modeller.
- Datamodellen har objektet `Task` med följande fält

  - `id`
  - `title`
  - `description`
  - `status` (tillåtna värden: `"to-do"`, `"in progress"`, `"blocked"`, `"done"`)
  - `assignedTo` (**referens till `User.id`, kan vara `null`**)
    Om värdet inte är `null` måste användaren finnas (validera i endpointen innan skrivning).
  - `createdAt` (**sätts automatiskt på serversidan**)
  - `finishedAt` (**sätts automatiskt när `status` uppdateras till `"done"`; annars `null`**)

- Datamodellen har objektet `User` med följande fält

  - `id`
  - `name`
  - `email` (**unik, giltigt format**)
  - `password` (**minst 8 tecken**, lagras **inte** i klartext, använd bcrypt ex.)

- Möjlighet att **skapa, läsa, uppdatera och ta bort** en `User`
- Möjlighet att **skapa, läsa, uppdatera och ta bort** en `Task`
- En `User` kan **tilldelas** en `Task` via fältet `assignedTo`
- **Grundläggande validering och felhantering**
  Vid ogiltig indata → `400`, resurs saknas → `404`, unikhetskonflikt (t.ex. e-post) → `409`, internt fel → `500`.

### Vidareutveckling för Väl Godkänt

Följande urval är exempel på vidareutveckling. Egna förslag välkomnas.

- Applikationen är **robust** med genomtänkt **felhantering och validering** (viktigast för VG)
- Utveckla datamodellen med fler fält och objekt
  – t.ex. `tags` på `Task`, `Project` (Trello-liknande board) där `Task` tillhör ett projekt
- **Authentication & Authorization**

  - Implementera autentisering med **JWT**
  - Endast autentiserade användare kan ändra sina uppgifter
  - **Rollhantering** (t.ex. `role: "admin"`) som kan administrera alla användare/uppgifter
  - **Färdigställare / audit (`finishedBy`)**
    - Lägg till fältet `finishedBy: User.id | null` på `Task` (**VG**).
    - Sätts **automatiskt på serversidan** när en task byter status från något annat till `"done"`; klienten ska **inte** skicka detta fält.
    - Använd den inloggade användaren från JWT (t.ex. `req.user.id`).

- **Kryptera lösenord** i databasen (hash + salt)
- Implementera möjlighet för användaren att **nollställa och välja nytt lösenord**

### Inlämning

- Lägg en textfil med svaren från **Teoretiska resonemang** i roten av repo (t.ex. `README.md`)
- Lämna in länk till git-repo (t.ex. GitHub) i Canvas
- Inlämning senast **måndagen den 29\:e september kl. 23:59**
- Bifoga en kort **körguide** i `README.md` (hur man startar, env-variabler). En enkel `env.example` uppskattas.

**Seed-data:**
Repo får gärna också innehålla:

- En scriptad seed (t.ex. `npm run seed`) som skapar **minst 2 users** (varav 1 admin om du gör VG-auth) och **minst 4 tasks** med blandade statusar.
- Lösenord i seed ska **hashas** (inte i klartext i DB).
- `assignedTo` i seed ska peka på befintlig user (eller vara `null`).
- (Om auth) dokumentera testkonto i `README.md` (t.ex. `admin@example.com` / `Passw0rd!`).
- Beskriv hur man kör seed i `README.md`.
