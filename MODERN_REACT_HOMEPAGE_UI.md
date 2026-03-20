# Modern & Stylish React Homepage UI Customization Guide

This guide provides tips and code snippets to help you design a modern, stylish homepage for your React frontend (student performance predictor). You can use these ideas as a starting point and further customize as needed.

---

## 1. Use a UI Library (Recommended)
- **Install Material-UI (MUI):**
  ```bash
  npm install @mui/material @emotion/react @emotion/styled
  ```
- **Or use Ant Design:**
  ```bash
  npm install antd
  ```

---

## 2. Example: Material-UI Form Layout
```jsx
import React, { useState } from 'react';
import { Container, Typography, Box, TextField, MenuItem, Button, Paper, Alert } from '@mui/material';

const genders = ["male", "female"];
const ethnicities = ["group A", "group B", "group C", "group D", "group E"];
const educations = [
  "associate's degree", "bachelor's degree", "high school", "master's degree", "some college", "some high school"
];
const lunches = ["free/reduced", "standard"];
const courses = ["none", "completed"];

export default function HomePage() {
  const [form, setForm] = useState({
    gender: '',
    race_ethnicity: '',
    parental_level_of_education: '',
    lunch: '',
    test_preparation_course: '',
    reading_score: '',
    writing_score: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError('Prediction failed.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Student Exam Performance Predictor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField select fullWidth label="Gender" name="gender" value={form.gender} onChange={handleChange} required margin="normal">
            {genders.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Race or Ethnicity" name="race_ethnicity" value={form.race_ethnicity} onChange={handleChange} required margin="normal">
            {ethnicities.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Parental Level of Education" name="parental_level_of_education" value={form.parental_level_of_education} onChange={handleChange} required margin="normal">
            {educations.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Lunch Type" name="lunch" value={form.lunch} onChange={handleChange} required margin="normal">
            {lunches.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Test Preparation Course" name="test_preparation_course" value={form.test_preparation_course} onChange={handleChange} required margin="normal">
            {courses.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Reading Score" name="reading_score" type="number" value={form.reading_score} onChange={handleChange} required margin="normal" inputProps={{ min: 0, max: 100 }} />
          <TextField fullWidth label="Writing Score" name="writing_score" type="number" value={form.writing_score} onChange={handleChange} required margin="normal" inputProps={{ min: 0, max: 100 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Predict Maths Score
          </Button>
        </Box>
        {prediction !== null && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Predicted Maths Score: <b>{prediction}</b> / 100
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
        )}
      </Paper>
    </Container>
  );
}
```

---

## 3. Additional Styling Tips
- Use gradients or background images for the page.
- Add a logo or illustration at the top.
- Use spacing (`sx` or `style` props) for a clean look.
- Add subtle animations (e.g., with Framer Motion or CSS transitions).
- Make the app responsive (MUI is responsive by default).

---

## 4. Resources
- [Material-UI Docs](https://mui.com/material-ui/getting-started/overview/)
- [Ant Design Docs](https://ant.design/components/overview/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Cool Backgrounds](https://coolbackgrounds.io/)

---

**You can copy and adapt the above code for your React homepage.**
