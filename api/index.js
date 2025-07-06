const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');

// Global variables
let tasks = [];

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {

    // Calculate task statistics
    let totalTasks = tasks.length;
    let completedTasks = tasks.filter(task => task.completed).length;
    let pendingTasks = totalTasks - completedTasks;
    let progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Render the index view with tasks and statistics
    res.render('index', {
        tasks: tasks, 
        totalTasks: totalTasks, 
        completedTasks: completedTasks, 
        pendingTasks: pendingTasks, 
        progress: progress
    });
});

app.post('/task/complete/all', (req, res) => {
    // Mark all tasks as completed
    tasks.forEach(task => task.completed = true);

    // Redirect to the home page
    res.redirect('/');
});

app.post('/task/delete/all', (req, res) => {
    // Clear all tasks
    tasks = [];

    // Redirect to the home page
    res.redirect('/');
});

app.post('/task/add', (req, res) => {

    // Get the todo and priorityRate from the request body
    const {todo, priorityRate} = req.body;

    // Add a new task to the tasks array
    if (todo) {
        tasks.push({_id: uuidv4(), todo: todo, priorityRate: priorityRate, completed: false});
        res.redirect('/');
    } 
});

app.post('/task/complete/:id', (req, res) => {

    // Get the task ID from the request parameters
    const taskId = req.params.id;

    // Find the task by ID and mark it as completed
    const task = tasks.find(task => task._id === taskId);
    if (task) {
        task.completed = true;

         // Redirect to the home page
        res.redirect('/');
    }

});

app.post('/task/delete/:id', (req, res) => {

    // Get the task ID from the request parameters
    const taskId = req.params.id

    // Remove the task from the tasks array
    tasks = tasks.filter(task => task._id !== taskId);

    // Redirect to the home page
    res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;