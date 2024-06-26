require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.APP_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/deals', async (req, res) => {
    console.log("here /deals")
    const deals = 'https://api.hubapi.com/crm/v3/objects/deals';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(deals, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Deals | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    if (req.query.id) {
        const objectId = req.query.id;
        const url = `https://api.hubspot.com/crm/v3/objects/deals/${objectId}?properties=dealname,dealstage,description,pipeline,amount`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await axios.get(url, { headers });
            const data = response.data;
            res.render('updates', { title: 'Update Deal Object Form | Integrating With HubSpot I Practicum.', data });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error retrieving custom object data");
        }
    } else {
        // no existing object ID, render the form for creating new object
        res.render('updates', { title: 'Create Deal Object | My HubSpot App' });
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    if (req.query.id) {
        const objectId = req.query.id;
        const url = `https://api.hubspot.com/crm/v3/objects/deals/${objectId}`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };
        const update = {
            properties: {
                dealname: req.body.dealname,
                pipeline: "default",
                dealstage: req.body.dealstage,
                description: req.body.description,
                amount: req.body.amount
            }
        };
        try {
            await axios.patch(url, update, { headers });
            res.redirect('/deals');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error updating custom object");
        }
    } else {
        // no existing object ID, create a new object
        console.log("creating new Deal Obj");
        const url = 'https://api.hubspot.com/crm/v3/objects/deals';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };
        const newDeal = {
            properties: {
                dealname: req.body.dealname,
                pipeline: "default",
                dealstage: req.body.dealstage,
                description: req.body.description,
                amount: req.body.amount,
            }
        };
        try {
            await axios.post(url, newDeal, { headers });
            res.redirect('/deals');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating Deal object");
        }
    }
});
/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/deals', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));