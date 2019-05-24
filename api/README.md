OLD:

POST /tokens -> create a token
GET /tokens/:tokenid -> get a token as an HTML page
GET /tokens/:tokenid.svg -> get a token as an SVG (note that I think this is just an HTML fragment)
GET /tokens/:tokenid.png -> get a token as a PNG (figure out where the parameters are coming from)
GET /my/tokens -> gets the tokens for the current user as an HTML page
GET /tokens -> gets the tokens from all users that aren't private
GET /account -> gets account page as HTML
GET /account/remove -> deletes the user
GET /news -> blog
GET /feedback -> feedback form
GET /policy -> policy page
GET /tokens/print -> creates a printable PDF?
GET /tokens/pack -> creates a ZIP download of multiple tokens

NEW:

POST    /api/token -> creates a token
GET     /api/token/:tokenid.json -> fetches a token as JSON
GET     /api/token/:tokenid.svg -> fetches a token as SVG
GET     /api/token/:tokenid@:size.png -> fetches a token as PNG, size is pixels
GET     /api/token -> lists tokens, includes pagination; include filter for users
GET     /api/token?mine -> alias for GET /api/set/mine

POST    /api/batch -> creates a set of tokens, a temporary bucket of tokens
GET     /api/batch/:batchid -> gets the status of the batch job
GET     /api/batch/:batchid@:size.pdf -> as a PDF, size is either A4 or Letter
GET     /api/batch/:batchid@:size.zip -> as a ZIP, size is pixels
- batch is only valid for 12 hours
- only one of the downloads will work

GET     /api/account/login/:provider -> redirect to login page for that provider
GET     /api/account/login/:provider/return -> handles the return from a provider
POST    /api/account/logout -> clears the session, logging out the user

- note that user storage is completely gone now - only using the cookie with information from live
