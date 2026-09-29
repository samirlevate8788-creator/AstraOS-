# AstraOS local feedback database

This Docker Compose setup stores AstraOS bug reports in PostgreSQL and provides Adminer at `http://127.0.0.1:8080` for local administration. Both services bind to loopback on this PC; this is a local development database, not a public website API.

## Start

1. Make sure Docker Desktop is running.
2. Copy `.env.example` to `.env` and set `POSTGRES_PASSWORD` to a long, unique password.
3. From the AstraOS project folder, run `docker compose up -d`.
4. Open `http://127.0.0.1:8080`. Sign in with system `PostgreSQL`, server `database`, username `astraos`, database `astraos_feedback`, and the password from `.env`.
5. Add a row to `bug_reports`. Do not enter account passwords, recovery keys, private keys, or unredacted logs.

The database is not connected to the public GitHub Pages site. GitHub Pages only serves static files; publishing public bug reports requires a separately hosted, authenticated HTTPS API. Keep the database port private. The initial schema runs only when Docker creates an empty data volume.

## Stop and back up

- Stop containers while retaining reports: `docker compose down`.
- Export a backup: `docker compose exec -T database pg_dump -U astraos astraos_feedback > astraos-feedback.sql`.
- Remove the local database and all reports: `docker compose down -v`.

Treat the backup as private data. `.env` is ignored by Git; never publish its password.
