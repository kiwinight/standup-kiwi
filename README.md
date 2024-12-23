# standup-kiwi

## Docker Deployment

### Quick Start

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

2. Clone and run:

```bash
git clone https://github.com/standup-kiwi/standup-kiwi.git
cd standup-kiwi
docker compose up
```

Services will be available at:
- Web: http://localhost:5173
- API: http://localhost:4000

### Common Commands

```bash
# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild
docker compose up -d --build
```

### Issues?
Check container status: `docker compose ps`
View logs: `docker compose logs`
