# Contributing to Token Builder

Thank you for taking the time to give feedback or contribute code or token parts.

## Giving Feedback / Requesting Parts

Feedback is always welcome in the form of a github issue.

Before raising an issue, please search to see if it has been raised before. If it has been raised, contributing a thumbs up to that original issue - it's the best way to tell what is most requested.

## Contributing Code

Code and bug fixes are always welcome. If you have an idea for a feature or want to add or tweak something, raise an issue and be ready for feedback.

### Getting setup

You will need the following installed on your box:
- docker
- node

You will need access to the following:
- github, to clone the repository
- google cloud platform
  - firestore, for storage
  - pubsub, for batch operations
  - storage buckets, for caching and results of batch operations
- microsoft live application
- google oauth application

After cloning, you will need to create a `config.json` and a `creds.json`.

`creds.json` should contain a JSON KEY for a service account in GCP that can be used to access:
- firestore
- pubsub
- storage bucket

`config.json` should follow the structure of `config.example.json`, with placeholder values replaced.

Once this is done, you'll need to build the token parts. Navigate to `~/token-parts` and run:

```bash
npm i
node ./bundle.js
```

This will dump the built SVG templates into both the API and the UX.

Once all that is done, run `docker-compose up` at the root and in theory, everything should come up.

### Conventions

Linting is run as part of the build process. You can run it locally by running `npm run lint` in the relevant folders.

I'm not picky about having lots of tests, but make sure you update any that touch on any change you make.

### Understanding architecture and questions

Reach out to contact@dougrich.net if you want to know more about how everything fits together or run into issues getting your dev environment set up.

## Contributing Token Parts

If you have ideas for parts, but no artwork, raise an issue.

If you want to create token parts, you need to understand SVG and have an editor (like inkscape).

Specifically, SVG files need:
- to have a 0 0 90 90 viewbox
- use a weight of 4.5 for thick outer lines
- use a weight of 2.75 for inner lines
- use a weight of 1.375 for thinner lines
- use only gray colors
- bodies need to be based off a circle centered at 45 45 that has radius 36 and stroke weight of 4.5
- place each 'color group' in a different `g` tag (see example below)
- use one color per color group
- add a `data-slots` attribute to the root `svg` that includes which slots it should intersect with
- add a `data-z` attribute to the root indicating what it's default z-order should be
- add a `data-tags` including a comma-delimited list of tags it should be available under when filtering parts
- not use any gradient fills - to achieve a gradient effect use a fill with a gradient mask, limitation of setting colors
- not use any filters like blurring, limitation of rendering engine

Basically they have to match the other parts. If you get most of the way through that list, feel free to open up the pull request with the partially completed part and I can help get it over the finish line and usable.

Parts are dedicated to the public domain. If you are contributing art, please add your name to the license.