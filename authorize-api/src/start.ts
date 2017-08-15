import * as express from 'express';
import * as cookieparser from 'cookie-parser';
import * as providers from './providers';

const client_id = '438476270135-5beqhma1nrkaj0llkkcdo16pmovvjqtd.apps.googleusercontent.com';
const app = express();
const host = "http://localhost";

app.use(cookieparser());
app.get('/login', express.static('./pages/login.html'));
app.get('/login/:provider', function (req, res, next) {
    if (!providers[req.params.provider]) {
        res.writeHead(400, {
            "X-Code": "400:bad-provider"
        });
        res.end();
    } else if (req.query.code) {
        providers[req.params.provider].verify(req, res, next);
    } else {
        providers[req.params.provider].authenticate(req, res, next);
    }
});