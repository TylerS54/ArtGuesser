import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Slider, Button, Grid,
   Box, TextField, Link, Switch, FormGroup, FormControlLabel,
   Select, MenuItem, FormControl, InputLabel, makeStyles   } from '@mui/material';
import { styled } from '@mui/material/styles';
import NightsStayIcon from '@mui/icons-material/NightsStay'; // Moon icon for dark mode
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Sun icon for light mode
import './App.css'; // Your CSS file for any additional styling





const PrettoSlider = styled(Slider)(({ mode }) => ({
  color: mode ? '#fff' : '#3d85c6',
  height: 8,
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: mode ? '#181720' : '#fff',
    boxShadow: '0px 0px 10px 1px rgba(61, 133, 198, 0.7)',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-track': {
    height: 8,
    borderRadius: 4,
    backgroundImage: 'linear-gradient(45deg, #9b90ab 30%, #886fa8 90%)',
  },
  '& .MuiSlider-rail': {
    color: '#d8d8d8',
    opacity: 1,
    height: 8,
    borderRadius: 4,
  },
}));

const StyledButton = styled(Button)({
  background: 'linear-gradient(45deg, #9b90ab 30%, #886fa8 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(129, 128, 141 .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '5px',
  '&:hover': {
    background: 'linear-gradient(45deg, #886fa8 30%, #9b90ab 90%)',
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    color: 'white',
    boxShadow: 'none',
  },
});

const NeuCard = styled(Card)(({mode}) => ({
  background: mode ? '#27263b' : '#dcd9f5',
  borderRadius: '15px',
  boxShadow: mode ? '11px 11px 22px #8080d9, -11px -11px 22px #8080d9' : '11px 11px 22px #cac7ef, -11px -11px 22px #cac7ef',
  padding: '20px',
}));


const App = () => {
  const [painting, setPainting] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [score, setScore] = useState(0);
  const [correctYear, setCorrectYear] = useState(null);
  const [message, setMessage] = useState('');
  const [objectBeginDate, setObjectBeginDate] = useState(0);
  const [objectEndDate, setObjectEndDate] = useState(new Date().getFullYear()); // Default to current year if not specified
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guessYear, setGuessYear] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [department, setDepartment] = useState('');

  const departments = [
    { departmentId: '', displayName: 'All Categories' },    
    {departmentId: 1, displayName: 'American Decorative Arts'},
    {departmentId: 3, displayName: 'Ancient Near Eastern Art'},
    {departmentId: 4, displayName: 'Arms and Armor'},
    {departmentId: 5, displayName: 'Arts of Africa, Oceania, and the Americas'},
    {departmentId: 6, displayName: 'Asian Art'},
    {departmentId: 7, displayName: 'The Cloisters'},
    {departmentId: 8, displayName: 'The Costume Institute'},
    {departmentId: 9, displayName: 'Drawings and Prints'},
    {departmentId: 10, displayName: 'Egyptian Art'},
    {departmentId: 11, displayName: 'European Paintings'},
    {departmentId: 12, displayName: 'European Sculpture and Decorative Arts'},
    {departmentId: 13, displayName: 'Greek and Roman Art'},
    {departmentId: 14, displayName: 'Islamic Art'},
    {departmentId: 15, displayName: 'The Robert Lehman Collection'},
    {departmentId: 16, displayName: 'The Libraries'},
    {departmentId: 17, displayName: 'Medieval Art'},
    {departmentId: 18, displayName: 'Musical Instruments'},
    {departmentId: 19, displayName: 'Photographs'},
    {departmentId: 21, displayName: 'Modern Art'}

  ];

  const handleChange = (event) => {
    event.preventDefault(); // This might not be necessary unless this is part of a form submission
    const departmentId = event.target.value;
    setDepartment(departmentId); // Updated to use setDepartment
    fetchPainting(departmentId);
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const toggleDarkMode = (event) => {
    setDarkMode(event.target.checked);
    document.body.classList.toggle('dark-mode');
  };
  

  const handlePlay = () => {
    setGameStarted(true);
    fetchPainting(setDepartment);
  };
  




  useEffect(() => {
    fetchPainting(setDepartment);
  }, [setDepartment]);

  const valueLabelFormat = (value) => `${value}`;


  const fetchPainting  = async (departmentId) => {
    try {
      const searchResponse = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', {
        params: {departmentId: department, q: "",  hasImages: true } // Ensure we're looking for paintings with images
      });
      const objectIDs = searchResponse.data.objectIDs;
      if (objectIDs.length === 0) {
        console.error('No paintings found.');
        return;
      }
      // Randomly select an objectID from the list
      const randomIndex = Math.floor(Math.random() * objectIDs.length);
      const objectID = objectIDs[randomIndex];
  
      const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
      if (objectResponse.data.primaryImage) {
        setPainting(objectResponse.data);
        setObjectBeginDate(objectResponse.data.objectBeginDate);
        setObjectEndDate(objectResponse.data.objectEndDate || new Date().getFullYear()); // Use current year if `objectEndDate` is not provided      
      } else {
        fetchPainting(setDepartment); // Try again if the selected painting doesn't have an image
      }
    } catch (error) {
      console.error('Error fetching painting:', error);
    }
    setHasGuessed(false); // Reset for the next guess

  };

  const handleSliderChange = (event, newValue) => {
    setYear(newValue);
  };

  // Handle changes from the text field
  const handleTextFieldChange = (event) => {
    setYear(Number(event.target.value) || new Date().getFullYear());
  };

  const handleYearChange = (event, newValue) => {
    setYear(newValue);
    setMessage(''); // Clear message when adjusting the slider
  };

  const handleSubmitGuess = () => {
    const guessYear = parseInt(year, 10);
    const actualYear = painting ? new Date(painting.objectEndDate).getFullYear() : null;
    setCorrectYear(actualYear); // Save the correct year for display
    let scoreAwarded = 0;

    if (guessYear >= objectBeginDate && guessYear <= objectEndDate) {
      setGuessYear(guessYear);
      scoreAwarded = 10000;
      setMessage(`\n✅ Correct! You guessed ${guessYear}.\nThe painting dates between ${objectBeginDate} and ${objectEndDate}.
      \nScore for this round: ${scoreAwarded}. \n\n`);

      // Update score as needed
    } else {
      const yearOff = Math.min(Math.abs(guessYear - objectBeginDate), Math.abs(guessYear - objectEndDate));
      scoreAwarded = Math.max(0, 10000 - (yearOff * 40)); // Subtract 40 points for each year off
      setGuessYear(guessYear);
      setMessage(`\n❌ Not quite! You guessed ${guessYear}. \nThe correct range is between ${objectBeginDate} and ${objectEndDate}. 
      \nScore for this round: ${scoreAwarded}. \n\n`);
    }
    
    setScore(score + scoreAwarded); // Update total score
    setHasGuessed(true);
    setIsSubmitDisabled(true); // Disable "Submit Guess" button
    setIsNextDisabled(false);   // Enable "Next Painting" button
  };

  const handleNextPainting = () => {
    if (roundsPlayed < 4) { // Since rounds are zero-indexed, 4 means 5 rounds have been played
      fetchPainting(setDepartment); // Fetch next painting logic
      setRoundsPlayed(roundsPlayed + 1); // Increment rounds played
    } else {
      setGameOver(true); // End the game after 5 rounds
    }
  
    setIsSubmitDisabled(false); // Re-enable "Submit Guess" for new painting
    setIsNextDisabled(true);    // Disable "Next Painting" until a guess is made
    setHasGuessed(false);       // Reset guess state
  };
  
  const handlePlayAgain = () => {
    setScore(0);            // Reset score
    setMessage('');
    setRoundsPlayed(0);     // Reset round counter
    setGameOver(false);     // Reset game over state
    fetchPainting(setDepartment);        // Start a new game with the first painting
    setIsSubmitDisabled(false);
    setIsNextDisabled(true);
  };
  
  const resetGame = () => {
    setScore(0); 
    setMessage('');
    setRoundsPlayed(0);
    setGameStarted(false);
    setGameOver(false);
    // Reset any other states as needed to bring the app back to its initial state
  };
  
  

  const fetchNextPainting = async () => {
    setShowNextButton(false); // Hide the "Next" button as we're fetching the next painting
    setHasGuessed(false); // Reset guessing state
    setMessage(''); // Optionally clear the message
    await fetchPainting(setDepartment); // Fetch the next painting
  };

  const formattedScore = new Intl.NumberFormat('en-US').format(score);


  return (
    <div className="App">
      <div className="dark-mode-toggle-container">
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label={darkMode ? <NightsStayIcon /> : <WbSunnyIcon />}
        labelPlacement="start"
      />
    </FormGroup>
    </div>
    
      {!gameStarted ? (
      // Homepage with Play button
<Box className="homepage" sx={{ /* existing styles */ }}>
  <Typography variant="h2"  gutterBottom>
    ART GUESSER
  </Typography>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* Add this line */}
    <StyledButton variant="contained" size="large" onClick={handlePlay}>
      Play
    </StyledButton>
    <FormControl fullWidth sx={{ minWidth: 140, maxWidth: 500, backgroundColor: darkMode ? '#27263b' : '#dcd9f5', color: darkMode ? '#fff' : '#000'  }}> {/* Adjust minWidth and maxWidth as needed */}
      <InputLabel id="department-select-label" sx={{color: darkMode ? '#fff' : '#000'}}>All Categories</InputLabel>
      <Select
        labelId="department-select-label"
        id="department-select"
        value={department}
        label="Department"
        onChange={handleChange}
        sx={{ color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#27263b' : '#dcd9f5' }}

      >
        {departments.map((dept) => (
          <MenuItem key={dept.departmentId} value={dept.departmentId}>
            {dept.displayName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
</Box>
    ) : (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <Typography  variant="h2">
        Round {roundsPlayed + 1}/5
      </Typography>
    </Box>
    )}
    {!gameOver ? (
    <Box className="gamePage" sx={{ flexGrow: 1, padding: 2, overflow: 'hidden' }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '90vh' }}>
        {painting && (
          <>
            {/* Image and Information Sections */}
            <Grid item xs={12} md={8} lg={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* Image Section */}
              <NeuCard mode={darkMode} className="card-enter-animation">
              <Card sx={{mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }} style={{ 
                backgroundColor: darkMode ? '#181720' : '#edecfa', 
                color: darkMode ? '#ccc' : '#000' 
                }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                  <Box
                    sx={{
                      maxHeight: '70vh', // Limits the image height
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <img
                      src={painting.primaryImage}
                      alt={painting.title}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain', // Ensures the aspect ratio is maintained
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
              </NeuCard>
              
              {/* Information Section */}
              {hasGuessed && (
              <NeuCard mode={darkMode} className="card-enter-animation">
              {/* Card content */}
              <Card style={{ 
                backgroundColor: darkMode ? '#181720' : '#edecfa', 
                color: darkMode ? '#ccc' : '#000' 
                }}>
                <CardContent>
                  <Typography variant="h5" component="div">{painting.title}</Typography>
                  <Typography variant="body2">
                    Artist: {painting.artistDisplayName}<br />
                    Date: Between {objectBeginDate} and {objectEndDate}<br />
                    Department: {painting.department}<br />
                    Medium: {painting.medium}<br /><br />
                  <Link href={painting.objectURL} target="_blank" rel="noopener">
                    View More Details
                  </Link>
                  </Typography>
                </CardContent>
              </Card>
              </NeuCard>
              )}
            </Grid>

            {/* Interaction Section */}
            <Grid item xs={12} md={4} lg={3}>
            <NeuCard mode={darkMode} className="card-enter-animation">
                {/* Card content */}
              <Card style={{ 
                backgroundColor: darkMode ? '#181720' : '#edecfa', 
                color: darkMode ? '#ccc' : '#000' 
                }}>
                <CardContent>
                <Typography>Guess the year the art was created:</Typography>
                  <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <PrettoSlider
                      mode={darkMode}
                      value={typeof year === 'number' ? year : 0}
                      onChange={handleSliderChange}
                      aria-labelledby="input-slider"
                      min={-2000}
                      max={2024}
                      disabled={isSubmitDisabled}
                    />
                  </Grid>
                  <Grid item >
                    <TextField
                      value={year}
                      onChange={handleTextFieldChange}
                      InputLabelProps={{
                        style: { color: darkMode ? 'white' : 'black' }, // Adjust label color for dark mode
                      }}
                      inputProps={{
                        style: {
                          color: darkMode ? 'white' : 'black', // Adjust text (value) color for dark mode
                        },
                        step: 1,
                        min: objectBeginDate,
                        max: objectEndDate,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                      }}
                      style={{
                        backgroundColor: darkMode ? '#27263b' : '#dcd9f5',
                      }}
                    />
                  </Grid>
                </Grid>
                <StyledButton onClick={handleSubmitGuess} disabled={isSubmitDisabled}>
                Submit Guess
                </StyledButton>
                <StyledButton onClick={handleNextPainting} disabled={isNextDisabled}>
                Next
                </StyledButton>
        

                  {message && <Typography >{message.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}{index < message.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  </Typography>}
                  <Typography>Your score: {formattedScore}</Typography>
                </CardContent>
              </Card>
              </NeuCard>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  ) : (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <Card sx={{ p: 2, minWidth: 300, background: '#f4effc' }}style={{ 
                backgroundColor: darkMode ? '#181720' : '#fff', 
                color: darkMode ? '#ccc' : '#000' 
                }}>
        <CardContent>
          <Typography variant="h4" component="div" sx={{ textAlign: 'center', mb: 2 }}>
            Game Over
          </Typography>
          <Typography variant="h5" component="div">
            Final Score: {formattedScore} /50,000
          </Typography>
          <StyledButton variant="contained" onClick={handlePlayAgain} sx={{ mt: 2, display: 'block', mx: 'auto' }}>
            Play Again
          </StyledButton>
          <StyledButton variant="contained" onClick={(resetGame)} sx={{ mt: 2, display: 'block', mx: 'auto' }}>
          Go Back to Home
        </StyledButton>
        </CardContent>
      </Card>
    </Box>
  )}
  
</div>
);
};

export default App;