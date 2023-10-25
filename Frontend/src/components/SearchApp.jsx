import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const paperStyle = {
  marginTop: "30px",
  padding: "20px",
  background: "lightblue",
  marginBottom: "20px",
};

const searchFieldStyle = {
  marginBottom: "10px",
  padding: "10px",
};

const buttonStyle = {
  marginTop: "10px",
};

const tableStyle = {
  marginTop: "20px",
};

const stylishTitle = {
  color: "purple",
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "center",
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#0000FF",
    },
  },
});

function SearchApp() {
  const [searchPoem, setSearchPoem] = useState("");
  const [searchPoet, setSearchPoet] = useState("");
  const [searchMetaphor, setSearchMetaphor] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const filteredResults = await axios.post(
      "http://localhost:4000/searchWithFilters",
      {
        poem: searchPoem,
        met_terms: searchMetaphor,
        poet: searchPoet,
      }
    );

    setSearchResults(filteredResults.data);
  };

  return (
    <Container>
      <Paper style={paperStyle}>
        <Grid container spacing={2}>
          <Grid item xs={4} style={searchFieldStyle}>
            <ThemeProvider theme={theme}>
              <TextField
                label="Search Poem"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{ style: { color: "blue" } }}
                value={searchPoem}
                onChange={(e) => setSearchPoem(e.target.value)}
              />
            </ThemeProvider>
          </Grid>
          <Grid item xs={4} style={searchFieldStyle}>
            <ThemeProvider theme={theme}>
              <TextField
                label="Search Poet"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{ style: { color: "blue" } }}
                value={searchPoet}
                onChange={(e) => setSearchPoet(e.target.value)}
              />
            </ThemeProvider>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              ...searchFieldStyle,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <ThemeProvider theme={theme}>
              <TextField
                label="Search Metaphor"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{ style: { color: "blue" } }}
                value={searchMetaphor}
                onChange={(e) => setSearchMetaphor(e.target.value)}
              />
            </ThemeProvider>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            style={buttonStyle}
          >
            Search
          </Button>
        </Grid>
      </Paper>
      <TableContainer component={Paper} style={tableStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Poem</TableCell>
              <TableCell>Poet</TableCell>
              <TableCell>Metaphor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.poem}</TableCell>
                <TableCell>{result.poet}</TableCell>
                <TableCell>{result.metaphor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default SearchApp;
