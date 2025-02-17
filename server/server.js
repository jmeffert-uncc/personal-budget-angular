// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/budget', (req, res) => {
    console.log('Budget endpoint called');
    res.json({
        data: {
            myBudget: [
                { title: 'Eat out', budget: 30 },
                { title: 'Rent', budget: 350 },
                { title: 'Groceries', budget: 90 },
                // Add more budget items as needed
            ]
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});