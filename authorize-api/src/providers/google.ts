export const google = {
    authenticate: function (req, res, next) {
        res.writeHead(302, {
            Location: `https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&redirect_uri=${encodeURIComponent(host + "/login/google")}&response_type=code&client_id=${client_id}`
        });
        res.end();
    },
    verify: function (req, res, next) {
        res.writeHead(302, {
            Location: "/login",
            "Set-Cookie": "s=t"
        });
        res.end();
    }
}