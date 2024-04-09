const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 5000;

const uri = 'mongodb+srv://kaushik321:767187@cluster0.cbz6m0k.mongodb.net/Banking?retryWrites=true&w=majority&appName=Cluster0';

// let corspolicy = {
//     origin:"http://localhost:3000"
// }
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
        // saveAccounts();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define a schema
const Schema = mongoose.Schema;

const accountSchema = new mongoose.Schema({
    owner: String,
    movements: [Number], // Array of movement objects
    interestRate: Number,
    pin: Number
});

// Define a model
const details = mongoose.model('details', accountSchema);

// Create a new document
// let accounts = [{"owner":"Sanjeeva Reddy Kadari","movements":[200,-200,340,-300,-20,50,400,-460],"interestRate":0.7,"pin":3333},
// {"owner":"Manjula Reddy Kadari","movements":[200,450,-400,3000,-650,-130,70,1300],"interestRate":1.2,"pin":1111},
// {"owner":"Rakhi Reddy Kadari","movements":[5000,3400,-150,-790,-3210,-1000,8500,-30],"interestRate":1.5,"pin":2222},
// {"owner":"Pandu Reddy Kadari","movements":[430,1000,700,50,90],"interestRate":1,"pin":4444}];

// async function saveAccounts(accounts) {
//     for (const acc of accounts) {
//         try {
//             const newAccount = new details(acc);
//             const savedAccount = await newAccount.save();
//             console.log('Document saved:', savedAccount);
//         } catch (error) {
//             console.error('Error saving document:', error);
//         }
//     }
// }

// async function addNewAccount(acc) {
//     try {
//         const newAccount = new details(acc);
//         const savedAccount = await newAccount.save();
//         console.log('Document saved:', savedAccount);
//     } catch (error) {
//         console.error('Error saving document:', error);
//     }
// }

async function updateAccounts(accounts) {
    for (const acc of accounts) {
        try {
            const filter = { owner : acc.owner}; 
            const update = { $set: acc };
            const options = {  
                upsert: true, // Add a new document if not found
                returnOriginal: false // Return the updated document 
            };
    
            const updatedAccount = await details.findOneAndUpdate(filter, update, options);
            console.log('Document updated:', updatedAccount);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }
    
}

// Define routes
app.get('/data', async (req, res) => {
    try {
        const data = await details.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/updateData', async (req, res) => {
    let accounts = req.body;
    await updateAccounts(accounts);
    res.status(200).json({ message: 'Data updated successfully' });
});

app.delete('/delete', async (req, res) => {
    const id = req.body._id;

    try {
        const deletedDocument = await details.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        return res.status(200).json({ message: 'Document deleted successfully', deletedDocument });
    } catch (error) {
        console.error('Error deleting document:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
