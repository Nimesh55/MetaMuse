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

const PoetSearch = () => {
  const [poetName, setPoetName] = useState("");
  const [poetResults, setPoetResults] = useState({});

  const handleSearch = async () => {
    setPoetResults({});
    const poetResult = await axios.post("http://localhost:4000/findWithPoet", {
      poet: poetName,
    });

    setPoetResults(poetResult.data);
  };

  const ulStyle = {
    listStyleType: "none",
  };

  return (
    <Box border={1} borderRadius={5} p={2} className="poet-search">
      <Typography variant="h4" gutterBottom>
        Poet Search
      </Typography>
      <TextField
        className="poet-search-input"
        label="Enter Poet Name"
        variant="outlined"
        fullWidth
        size="small"
        style={{ marginBottom: 8 }}
        value={poetName}
        onChange={(e) => setPoetName(e.target.value)}
      />
      <Button
        className="poet-search-button"
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        style={{ marginTop: 8 }}
        onClick={handleSearch}
      >
        Search
      </Button>
      {poetResults.poem_list && poetResults.poem_list.length > 0 && (
        <div className="poet-results">
          <p>
            <strong>Poet Name:</strong> {poetResults.poet || ""}
          </p>
          <p>
            <strong>Count of Poems:</strong> {poetResults.poem_count || 0}
          </p>
          <p>
            <strong>Example Names of Poems:</strong>
          </p>
          <List>
            {poetResults.poem_list.map((poem, index) => (
              <ListItem key={index}>
                <ListItemText primary={poem} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Box>
  );
};

export default PoetSearch;
