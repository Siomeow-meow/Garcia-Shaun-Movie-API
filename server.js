const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// In-memory data storage
let movies = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010 },
    { id: 2, title: 'The Godfather', genre: 'Crime', year: 1972 },
    { id: 3, title: 'Parasite', genre: 'Thriller', year: 2019 },
];
let nextId = 4;

// GET /api/movies - retrieve all movies
app.get('/api/movies', (req, res) => {
    res.json(movies);
});

// GET /api/movies/:id - retrieve one movie
app.get('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find((m) => m.id === id);

    if (!movie) {
        return res.status(404).json({ error: `Movie with id ${id} not found` });
    }

    res.json(movie);
});

// POST /api/movies - add a new movie
app.post('/api/movies', (req, res) => {
    const { title, genre, year } = req.body;

  // Validate required fields
    const missing = [];
    if (!title) missing.push('title');
    if (!genre) missing.push('genre');
    if (year === undefined || year === null || year === '') missing.push('year');

    if (missing.length > 0) {
        return res.status(400).json({
        error: `Missing required field(s): ${missing.join(', ')}`,
        });
    }

    if (isNaN(Number(year))) {
        return res.status(400).json({ error: 'Field "year" must be a number' });
    }

    const newMovie = {
        id: nextId++,
        title: String(title),
        genre: String(genre),
        year: Number(year),
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.listen(PORT, () => {
    console.log(`Movie Collection API running at http://localhost:${PORT}`);
});