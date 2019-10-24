const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const renderLandingPage = require('./server/controllers/renderLandingPage')

app.engine('html', exphbs({
    defaultLayout: 'main',
    extname: '.html',
    layoutsDir: 'views/layouts/'
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', renderLandingPage);

console.log('==================');
console.log('process.env.PORT', process.env.PORT);
console.log('==================');

app.listen(process.env.PORT || 8001, () => {
    console.log('andrews-garden: listening on port 8001');
});