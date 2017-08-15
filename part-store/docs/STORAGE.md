Storage as file system, indexed on demand

File is stored as BSON:
```
{
    meta: {
        name: string;
        tags: string[];
        description: string;
        author: string;
        availableFrom: Date?;
        availableTo: Date?;
    }
    raw: SVG;
    optimized: SVG;
}
```

File name is: `<id>/<hash>.json`