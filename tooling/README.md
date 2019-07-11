# Tooling

`npm start -- bundle` rebuilds all the parts

`npm start -- analyze <name>` analyzes a specific property of token parts

`npm start -- replace <name> <old> <new>` replaces a property across all token parts - useful for bulk-updating

`npm start -- remove <name> <value>` removes a property across all token parts - useful for removing tags

`npm start -- export` exports all tokens into elasticsearch

## Analytics

Analytics is done with Kibana + Elasticsearch.

Run:

```
docker-compose up -d
...wait until stable...
npm run restore-kibana // restores kibana visualizations and dashboards
npm start -- export http://localhost:9200 // exports token data into elasticsearch
```