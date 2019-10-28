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

app.get('/', (req, res) => res.redirect('/summer19'));
// app.get('/summer19', renderLandingPage);
app.get('/summer19', (req, res) => renderLandingPage(req, res, 'Summer 2019'));
app.get('/winter20', (req, res) => renderLandingPage(req, res, 'Winter 2020'));
app.get('/gallery', (req, res) => res.render('gallery'));

app.listen(process.env.PORT || 8001, () => {
    console.log('andrews-garden: listening on port 8001');
});
