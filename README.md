# Token Builder

This is all the code that powers https://tokens.dougrich.net

## Architecture

The code is roughly broken into 5 big parts: __api__, __batch__, __ux__, __pipe__, and __gateway__.

__api__ is an HTTP service which hosts the service endpoints and authentication

__batch__ is a pubsub subscriber which asynchronously handles batch commands

__ux__ is both an HTTP service and a client-side application

__pipe__ is a pipe to take the legacy storage (mongodb documents) and pump them into the new DB

__gateway__ is a NGINX gateway that correctly maps all the routes, handles SSL termination, and caches static assets

Additionally, there are the following root folders:

__.circleci__ which contains the continuous integration commands

__deploy__ which contains deployment scripts and utilities

__misc__ which contains related pictures and similar that don't fit under a specific group

__token-parts__ which contains the raw token parts

## Common Developer Operations

### Reset new parts:

```
cd tooling
npm start -- remove tag new
```

### Run locally

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

After starting the containers, the part volumes should be mounted so it auto refreshes when making changes.

### Part Development Checklist

- [ ] Create artwork
- [ ] Ensure layers are separate
- [ ] Ensure each layer can be colored independently