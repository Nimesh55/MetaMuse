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

const MetaphorSearch = () => {
  const [meaningMetaphor, setMeaningMetaphor] = useState("");
  const [exampleMetaphor, setExampleMetaphor] = useState("");
  const [meaningResult, setMeaningResult] = useState("");
  const [exampleResults, setExampleResults] = useState([]);

  const handleSearchMeaning = async () => {
    setMeaningResult("");
    const meaningResult = await axios.post(
      "http://localhost:4000/searchMeaning",
      {
        met_terms: meaningMetaphor,
      }
    );

    setMeaningResult(meaningResult.data.meaning);
  };

  const handleSearchExample = async () => {
    setExampleResults([]);
    const exampleResult = await axios.post(
      "http://localhost:4000/searchMetExamples",
      {
        met_terms: exampleMetaphor,
      }
    );

    console.log(exampleResult.data);

    setExampleResults(exampleResult.data);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <Box border={1} borderRadius={5} p={2} className="metaphor-search">
            <Typography variant="h4" gutterBottom>
              Find Meaning of Metaphor
            </Typography>
            <TextField
              className="metaphor-search-input"
              label="Enter Metaphor"
              variant="outlined"
              fullWidth
              size="small"
              style={{ marginBottom: 8 }}
              value={meaningMetaphor}
              onChange={(e) => setMeaningMetaphor(e.target.value)}
            />
            <Button
              className="metaphor-search-button"
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              style={{ marginTop: 8 }}
              onClick={handleSearchMeaning}
            >
              Search Meaning
            </Button>
            <span></span>
            <div>
              <span>Meaning: {meaningResult}</span>
            </div>
          </Box>
        </div>
        <div style={{ flex: 1 }}>
          <Box border={1} borderRadius={5} p={2} className="metaphor-search">
            <Typography variant="h4" gutterBottom>
              Find Example Usages of Metaphor
            </Typography>
            <TextField
              className="metaphor-search-input"
              label="Enter Metaphor"
              variant="outlined"
              fullWidth
              size="small"
              style={{ marginBottom: 8 }}
              value={exampleMetaphor}
              onChange={(e) => setExampleMetaphor(e.target.value)}
            />
            <Button
              className="metaphor-search-button"
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              style={{ marginTop: 8 }}
              onClick={handleSearchExample}
            >
              Search Examples
            </Button>
            <List className="metaphor-results">
              {exampleResults.map((item, index) => (
                <ListItem key={index} className="metaphor-list-item">
                  <ListItemText
                    primary={`Poem name: ${item.poem_name} (${item.poet})`}
                    secondary={`Example: ${item.line}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default MetaphorSearch;
