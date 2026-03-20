import React, { useState, useCallback } from 'react';
import {
  Container, Typography, Box, TextField, MenuItem, Button, Paper,
  CircularProgress, Fade, Grow, Chip, Divider, IconButton, Tooltip
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ── dark MUI theme ─────────────────────────────────── */
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#7c4dff' },
    secondary: { main: '#00e5ff' },
    background: { default: 'transparent', paper: 'rgba(30, 27, 60, 0.75)' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 500, color: '#b0b0cc' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true, margin: 'normal' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.04)',
            transition: 'background 0.3s, box-shadow 0.3s',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.07)' },
            '&.Mui-focused': {
              backgroundColor: 'rgba(124,77,255,0.06)',
              boxShadow: '0 0 0 2px rgba(124,77,255,0.25)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 700, fontSize: '1rem' },
      },
    },
  },
});

/* ── form option constants ──────────────────────────── */
const GENDERS      = ['male', 'female'];
const ETHNICITIES  = ['group A', 'group B', 'group C', 'group D', 'group E'];
const EDUCATIONS   = ["associate's degree", "bachelor's degree", "high school", "master's degree", "some college", "some high school"];
const LUNCHES      = ['free/reduced', 'standard'];
const COURSES      = ['none', 'completed'];

const INITIAL_FORM = {
  gender: '', race_ethnicity: '', parental_level_of_education: '',
  lunch: '', test_preparation_course: '', reading_score: '', writing_score: '',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ── score colour helper ────────────────────────────── */
function scoreColor(score) {
  if (score >= 80) return '#00e676';
  if (score >= 60) return '#7c4dff';
  if (score >= 40) return '#ffab00';
  return '#ff5252';
}
function scoreLabel(score) {
  if (score >= 90) return 'Outstanding!';
  if (score >= 80) return 'Excellent!';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 40) return 'Below Average';
  return 'Needs Improvement';
}

/* ── reusable select field ──────────────────────────── */
function SelectField({ label, name, value, options, onChange, id }) {
  return (
    <TextField select label={label} name={name} value={value} onChange={onChange} required id={id}>
      {options.map(opt => (
        <MenuItem key={opt} value={opt} sx={{ textTransform: 'capitalize' }}>{opt}</MenuItem>
      ))}
    </TextField>
  );
}

/* ── main app ───────────────────────────────────────── */
export default function App() {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading]     = useState(false);

  const handleChange = useCallback(e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setPrediction(null);
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    setPrediction(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        reading_score: Number(form.reading_score),
        writing_score: Number(form.writing_score),
      };
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error (${res.status})`);
      }
      const data = await res.json();
      setPrediction(data.prediction);
      toast.success('Prediction completed!', { theme: 'dark' });
    } catch (err) {
      toast.error(err.message || 'Failed to get prediction', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  }, [form]);

  return (
    <ThemeProvider theme={darkTheme}>
      <ToastContainer position="top-right" autoClose={3500} />

      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        {/* ── header ── */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={4}>
            <SchoolIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1, filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.4))' }} />
            <Typography variant="h3" sx={{ background: 'linear-gradient(135deg, #7c4dff, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Performance Predictor
            </Typography>
            <Typography variant="subtitle1" mt={1}>
              Enter student details to predict the expected math score
            </Typography>
          </Box>
        </Fade>

        {/* ── form card ── */}
        <Grow in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 48px rgba(124,77,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Chip icon={<AutoGraphIcon />} label="AI Prediction" color="primary" variant="outlined" size="small" />
              <Tooltip title="Reset form">
                <IconButton onClick={handleReset} size="small" sx={{ color: 'text.secondary' }} id="reset-btn">
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              {/* selects */}
              <SelectField id="field-gender" label="Gender" name="gender" value={form.gender} options={GENDERS} onChange={handleChange} />
              <SelectField id="field-ethnicity" label="Race / Ethnicity" name="race_ethnicity" value={form.race_ethnicity} options={ETHNICITIES} onChange={handleChange} />
              <SelectField id="field-education" label="Parental Education" name="parental_level_of_education" value={form.parental_level_of_education} options={EDUCATIONS} onChange={handleChange} />
              <SelectField id="field-lunch" label="Lunch Type" name="lunch" value={form.lunch} options={LUNCHES} onChange={handleChange} />
              <SelectField id="field-course" label="Test Prep Course" name="test_preparation_course" value={form.test_preparation_course} options={COURSES} onChange={handleChange} />

              {/* numeric scores */}
              <Box display="flex" gap={2} mt={1}>
                <TextField
                  id="field-reading" label="Reading Score" name="reading_score" type="number"
                  value={form.reading_score} onChange={handleChange} required
                  slotProps={{ htmlInput: { min: 0, max: 100 } }}
                />
                <TextField
                  id="field-writing" label="Writing Score" name="writing_score" type="number"
                  value={form.writing_score} onChange={handleChange} required
                  slotProps={{ htmlInput: { min: 0, max: 100 } }}
                />
              </Box>

              {/* submit */}
              <Button
                id="predict-btn"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3, py: 1.5,
                  background: 'linear-gradient(135deg, #7c4dff 0%, #448aff 100%)',
                  boxShadow: '0 4px 20px rgba(124,77,255,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #651fff 0%, #2979ff 100%)',
                    boxShadow: '0 6px 28px rgba(124,77,255,0.45)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s',
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUpIcon />}
              >
                {loading ? 'Predicting…' : 'Predict Math Score'}
              </Button>
            </Box>

            {/* ── result ── */}
            {prediction !== null && (
              <Fade in timeout={500}>
                <Box mt={4}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
                  <Box
                    textAlign="center"
                    sx={{
                      py: 3, px: 2, borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(scoreColor(prediction), 0.12)} 0%, rgba(0,0,0,0.2) 100%)`,
                      border: `1px solid ${alpha(scoreColor(prediction), 0.25)}`,
                    }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 36, color: scoreColor(prediction), mb: 1, animation: 'pulse 2s infinite' }} />
                    <Typography variant="subtitle1" sx={{ color: '#999', mb: 0.5 }}>
                      Predicted Math Score
                    </Typography>
                    <Typography variant="h3" sx={{ color: scoreColor(prediction), textShadow: `0 0 24px ${alpha(scoreColor(prediction), 0.4)}` }}>
                      {prediction.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>out of 100</Typography>
                    <Chip label={scoreLabel(prediction)} size="small"
                      sx={{ mt: 1.5, color: scoreColor(prediction), borderColor: alpha(scoreColor(prediction), 0.5) }}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Fade>
            )}
          </Paper>
        </Grow>

        {/* ── footer ── */}
        <Typography variant="body2" align="center" sx={{ mt: 4, color: '#555' }}>
          Powered by ML · Built with FastAPI &amp; React
        </Typography>
      </Container>

      {/* pulse animation for the trophy icon */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
      `}</style>
    </ThemeProvider>
  );
}
