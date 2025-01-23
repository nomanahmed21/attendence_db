import mongoose from "mongoose";
import express from  "express";
import path from "path";
import { fileURLToPath } from "url";



// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 5000
app.use(express.json())
app.use(express.static('public'));



const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/Atten_app');// make the free cluster from mongodb and replace the connection sting with it so the data can be accessed while hosting
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
    }
  };

connectDB();

const studentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  });
  
  const Student = mongoose.model('Student', studentSchema);

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public','teacher.html'))
})

app.get('/get-students', async (req, res) => {
  try {
    // Wait for the data to resolve
    const data = await Student.find();
    if (!data) {
      return res.status(404).json({ error: 'No student found' });
    }
    res.status(200).json(data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/add-students', async (req, res) => {
    try {
        const students = req.body.students;

        // Save students to the database
        const savedStudents = await Student.insertMany(students);

        res.status(200).json({
            message: 'Students added successfully',
            data: savedStudents
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add students',
            error: error.message
        });
    }
});

app.listen(port,() => console.log(`Server running on http://localhost:${port}`));
