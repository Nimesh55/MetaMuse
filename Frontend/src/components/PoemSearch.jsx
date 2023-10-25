import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const PoemSearch = () => {
  const [poemName, setPoemName] = useState("");
  const [poemResults, setPoemResults] = useState({});

  const handleSearch = async () => {
    setPoemResults({});
    const poemResult = await axios.post("http://localhost:4000/findWithPoem", {
      poem: poemName,
    });

    setPoemResults(poemResult.data);
  };

  const ulStyle = {
    listStyleType: "none",
  };

  return (
    <Box border={1} borderRadius={5} p={2} className="poem-search">
      <Typography variant="h4" gutterBottom>
        Poem Search
      </Typography>
      <TextField
        className="poem-search-input"
        label="Enter Poem Name"
        variant="outlined"
        fullWidth
        size="small"
        style={{ marginBottom: 8 }}
        value={poemName}
        onChange={(e) => setPoemName(e.target.value)}
      />
      <Button
        className="poem-search-button"
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        style={{ marginTop: 8 }}
        onClick={handleSearch}
      >
        Search
      </Button>
      {poemResults.poem_lines && poemResults.poem_lines.length > 0 && (
        <div className="poem-results">
          <p>
            <strong>Poem Name:</strong> {poemResults.poem_name || ""}
          </p>
          <p>
            <strong>Poet:</strong> {poemResults.poet || ""}
          </p>
          <ul style={ulStyle}>
            {poemResults.poem_lines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
};

export default PoemSearch;
