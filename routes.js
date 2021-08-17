const fs = require('fs')

const requestHandler = (req, res) => {
    const url = req.url
    const method = req.method
    if (url === '/') {
        res.write('<html><head><title>Create User App</title></head>');
        res.write('<body>');
        res.write('<p>Welcome to Wkwkland!!</p>');
        res.write('<p>Enter a new user below:</p>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="create-user"><button type="submit">Create User</button></form>');
        res.write('</body></html');
        res.end();
    }

    if (url==='/users'){
        fs.readFile('users.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            res.write('<html><head><title>User List</title></head>');
            res.write('<body>');
            res.write('<p>UserList</p>');

            const users = data.split('\r\n');
            res.write('<ul>');
            users.forEach(user => {
                if (user !== '') res.write('<li>'+user+'</li>')
            });
            res.write('</ul>');

            res.write('<a href="/">Create another user</a>');
            res.write('</body></html');
            res.end();
        });
    }

    if (url==='/create-user' && method==='POST') {
        const body = [];
        req.on('data', (chunk) =>{
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            fs.appendFile('users.txt', message + '\r\n', (err) =>{
                if (err) throw err;
                console.log('Created new user :' + message);
                res.statusCode = 302;
                res.setHeader('Location', '/users');
                return res.end();
            });
        });
    }

};

module.exports.handler = requestHandler;