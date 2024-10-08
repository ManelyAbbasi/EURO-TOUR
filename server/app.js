var express = require('express');
const session = require('express-session');

var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animalDevelopmentDB';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function(err) {
    console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.error(err.stack);
    process.exit(1);
}).then(function() {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
var app = express();

// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP request logger
app.use(morgan('dev'));

// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors({
    exposedHeaders: ['x-auth-token'],
}));

// Import routes
const citiesRoutes = require('./routes/citiesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const placesRoutes = require('./routes/placesToVisitRoutes');
const authentication = require('./middleware/authentication');

// Basic API endpoint
app.get('/api', function(req, res) {
    res.json({ 'message': 'Welcome to your DIT342 backend ExpressJS project!' });
});

// Define API routes
app.use('/api/cities', citiesRoutes);
app.use('/api/users', authentication, usersRoutes);
app.use('/api/places', placesRoutes);

// Catch all non-error handler for API (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vue.js HTML 5 history mode
app.use(history());

// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when an exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

// Start the server
app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
