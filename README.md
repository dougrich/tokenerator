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

#### Do Once

1. Create a `config.json` based on `config.example.json` & give access to google compute by providing a `creds.json` which contains a google account code. You'll need to create the firebase account in google compute.
2. Create a `config.auth.json` based on `config.auth.example.json`. Each provider will need to be setup with their own credentials.

#### Developer Loop

1. Start the containers with

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

2. Bundle the token parts

```
cd tooling
npm start -- bundle
```

3. Make changes to either code (re-run docker-compose commands) or token parts (re-run bundling commands)

#### Troubleshooting

**Missing `ux/src/token-parts` or `api/src/token-parts`** - you're missing the output from the token parts bundle. Check that you ran step 2 of the developer loop.

### Part Development Checklist

If you're adding a new part, run through this checklist:

- [ ] Create artwork
- [ ] Ensure layers are separate. Each layer needs to be a root level `g` tag in the SVG
- [ ] Ensure each layer can be colored independently. Each layer will have the `fill` style element replaced with a new value.
- [ ] Each layer needs a unique class attribute. This determines their name in the code & should be on the `g` element. It is saved as part of the token.

