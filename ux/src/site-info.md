Last updated: July 11, 2019

## Privacy Information

### Terms

___OAuth___ is a system that, when you want to sign in, redirects you to an authority that then grants this application access to some of your information.

___OAuth Provider___ is the account provider that you signed in with: either Google or Microsoft.

A ___user id___ is a unique, random id provided by your oauth provider. It contains no personally identifiable information.

### Tracking/Data Usage
I track as little as possible. No data is collected until you create a token.

When you create a token, I make note of:
- the title you provided
- the description you provided
- whether or not you checked 'private'
- what time it is on my servers
- if you are signed in, your user id

This is done to provide functionality for the browse page and token details pages.

When you batch download tokens, I do not collect any information.

This information is collected to:
- provide the token details page (title, description)
- enable the browse page to function (title, privacy choice, time submitted)
- enable browsing your own tokens (user id)
- anonymous site analytics, viewable [here](https://github.com/dougrich/tokenerator/tree/master/reports).

To completely understand the analytics, I recommend looking at the reports linked above.

The analytics are entirely anonymous. no personally identifiable information is collected.

The following metrics are tracked:

__# tokens created, avg. #parts per token, avg. #tokens created, #total unique parts used__

This is used to get an idea of how active the site is without tracking anything personal and to estimate future capacity for infrastructure.

__% of tokens created by users vs. anonymous, % of tokens with title or description, % of tokens that are hidden or browseable__

This is used to get an idea of how often specific features are being used, like the title and description or sign in flow.

__most popular parts__

This is used to come up with ideas for new parts that will be liked.

__# active users, # new users, # returning users__

This is used to gauge how active the site is and if it is growing or shrinking.

__# tokens per user, % sign in provider used__

This is used to estimate capacity, plan features, and prioritize login provider support.

### Cookies / Signing In

By default I do not use cookies.

If you sign in, I create a cookie that contains:
- your user id, an anonymous id, to enable the browse page for signed in users
- your name, as provided by your oauth provider, to provide a good UX
- your provider, to ensure if two providers give the same anonymous id there is no conflict

I do not keep any additional account information.

## Reporting Issues

Please navigate here to open an issue on the Github Repository if you encounter an issue.

If you have a security issue, please reach out to [contact@dougrich.net](mailto:contact@dougrich.net) with information and reproduction steps.

## Terms of Use

### Copyright

When you make a token, you must either own or have licensed the copyright of the character depicted, description provided, and title provided. By using this application, you are making that content available publicly.

If you suspect your copyright has been violated, please report it to [contact@dougrich.net](mailto:contact@dougrich.net) with a link to the offending token.

## License

This site operates under two licenses: one for the code, and one for the artwork included.

### Code/Application License

The code and application are licensed to you under the MIT License, provided here and in the Github Repository.

```
Copyright 2019 Douglas Richardson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### Artwork License

[![CC0](https://i.creativecommons.org/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, Douglas Richardson have waived all copyright and related or neighboring rights to Token Builder Artwork. This work is published from: Canada.