const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/menu', (req, res) => {
  fs.readFile('mess.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading menu data file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const menuData = JSON.parse(data);
    res.json(menuData);
  });
});

// Endpoint to filter meal data by category, type, day, and meal
app.get('/api/menu/filter', (req, res) => {
  const { menu, week, day, meal } = req.query;

  if (!menu || !week || !day || !meal) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  fs.readFile('mess.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading menu data file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const menuData = JSON.parse(data);

    if (!menuData[menu]) {
      return res.status(404).json({ error: `Category not found: ${category}` });
    }

    const categoryData = menuData[menu][week];

    if (!categoryData) {
      return res.status(404).json({ error: `Type not found: ${type}` });
    }

    const dayMenu = categoryData[day];

    if (!dayMenu) {
      return res.status(404).json({ error: `Menu not found for ${day}` });
    }

    const selectedMeal = dayMenu[meal];

    if (!selectedMeal) {
      return res.status(404).json({ error: `Meal not found: ${meal}` });
    }

    res.json(selectedMeal);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
