const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 4300;
const server = express();

const PORT_LOCAL = 4200;
const PORT_MONOLITH = 8443;

/*const corsOptions = {
    origin: `https://localhost:${PORT_MONOLITH}`,
    optionsSuccessStatus: 200,
};*/

const whitelist = [
    'http://localhost:3000',
    'http://localhost:4201'
    // `http://localhost:${PORT}`,
    // `http://localhost:${PORT_LOCAL}`,
    // `https://localhost:${PORT_MONOLITH}`,
    // `https://qa.cdn.aa.com`
];

/*let corsOptions = {
    origin: function(origin, callback) {
        // allow requests with no origin
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) === -1) {
            let message = "The CORS policy for this origin doesn't allow access from the particular origin.";
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    methods: "GET, PUT"
};*/

/*const corsOptionsDelegate = (req, callback) => {
    let corsOptions;

    let isDomainAllowed = whitelist.indexOf(req.header("Origin")) !== -1;
    let isExtensionAllowed = req.path.endsWith(".js");

    if (isDomainAllowed && isExtensionAllowed) {
        // Enable CORS for this request
        corsOptions = { origin: true };
    } else {
        // Disable CORS for this request
        corsOptions = { origin: false };
    }
    corsOptions.optionsSuccessStatus = 200;
    corsOptions.methods = "GET, PUT";

    callback(null, corsOptions);
};*/

server.use(cors());
// server.use(cors(corsOptionsDelegate));

server.listen(PORT, () => {
    console.log(`AA Mock CDN Server has started.  Listening on port: ${PORT}.  http://localhost:${PORT}`);
});

// server.use(express.static(path.join(__dirname, 'booking/dist/booking')));
// server.use('/bundles/assets/js/booking', express.static(path.join(__dirname, 'booking/dist/booking')));
server.use('/homepage/components', express.static(path.join(__dirname, 'projects/components/dist/components')));
server.use('/assets/locales', express.static(path.join(__dirname, 'projects/components/dist/components/assets/locales')));

// server.use(express.static(path.join(__dirname, 'components/dist/components')));
// server.use('/bundles/assets/js/hero', express.static(path.join(__dirname, 'hero/dist/hero')));
// server.use('/homepage/hero', express.static(path.join(__dirname, 'hero/dist/hero')));

// server.use('/bundles/assets/images/hero', express.static(path.join(__dirname, 'hero/dist/hero')));
