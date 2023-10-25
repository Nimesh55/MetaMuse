const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var cors = require("cors");

const fs = require("fs");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

app.locals.elasticClient = client;
console.log("Connected to Elasticsearch");

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const jsonObject = JSON.parse(data);
    return jsonObject;
  } catch (error) {
    console.error("Error reading or parsing the JSON file:", error);
    return null;
  }
}

const mappings_data = readJsonFile("json/mapping_file.json");
const dataset = readJsonFile("json/sinhala_metaphors.json");

async function run() {
  const indexExists = await client.indices.exists({
    index: "sinhala_metaphors",
  });

  if (indexExists) {
    const deleteResponse = await client.indices.delete({
      index: "sinhala_metaphors",
    });
    console.log("Index deleted:", deleteResponse);
  }

  await client.indices.create({
    index: "sinhala_metaphors",
    body: mappings_data,
  });
  console.log("New index created successfully.");

  const body = dataset.flatMap((doc) => [
    { index: { _index: "sinhala_metaphors" } },
    doc,
  ]);

  const bulkResponse = await client.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: "sinhala_metaphors" });
  console.log("Total documents in the index: " + count.count);
}

run().catch(console.log);

// Find meaning of the metaphor
app.post("/searchMeaning", async (req, res) => {
  const metaphor = req.body.met_terms;

  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      size: 1,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  metaphorical_terms: metaphor,
                },
              },
              {
                range: {
                  metaphor_count: {
                    gt: 0,
                  },
                },
              },
            ],
          },
        },
      },
    });
    result = response.hits.hits[0]._source.meaning_of_metaphorical_terms;

    res.json({
      meaning: result,
    });
  } catch (error) {
    res.status(500).json("{ error: error.message }");
  }
});

// Find example usages for metaphor
app.post("/searchMetExamples", async (req, res) => {
  const metaphor = req.body.met_terms;

  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      size: 3,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  metaphorical_terms: metaphor,
                },
              },
              {
                range: {
                  metaphor_count: {
                    gt: 0,
                  },
                },
              },
            ],
          },
        },
      },
    });
    results = response.hits.hits;
    const selected_examples = [];
    results.forEach((example) => {
      console.log(example);

      selected_examples.push({
        poem_name: example._source.poem_name,
        poet: example._source.poet,
        line: example._source.line,
      });
    });

    res.json(selected_examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a sample list of lines of poems with metaphors
app.get("/searchAll", async (req, res) => {
  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      size: 100,
      from: 0,
      body: {
        query: {
          range: {
            metaphor_count: {
              gt: 0,
            },
          },
        },
      },
    });
    result = response.hits.hits;

    results_out = [];
    result.forEach((element) => {
      results_out.push({
        poem: element._source["poem_name"],
        poet: element._source["poet"],
        metaphor: element._source["metaphorical_terms"],
      });
    });

    res.json(results_out);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the summary of poet
app.post("/findWithPoet", async (req, res) => {
  const poet = req.body.poet;
  console.log(poet);

  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      body: {
        size: 0,
        aggs: {
          total_sum: {
            filter: {
              match: {
                poet: poet,
              },
            },
            aggs: {
              unique_domains: {
                terms: {
                  field: "poem_index",
                },
              },
            },
          },
        },
      },
    });

    const own_poems = response.aggregations.total_sum.unique_domains.buckets;
    let poem_count = 0;
    own_poems.forEach((poem) => {
      if (poem.key !== "") {
        poem_count++;
      }
    });

    const response_lines = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      body: {
        query: {
          match: {
            poet: poet,
          },
        },
      },
    });

    const own_poem_lines = response_lines.hits.hits;
    const own_poems_list = [];
    own_poem_lines.forEach((poem) => {
      const poem_name = poem._source.poem_name;
      if (!own_poems_list.includes(poem_name)) {
        own_poems_list.push(poem_name);
      }
    });

    const responseData = {
      poet: poet,
      poem_count: poem_count,
      poem_list: own_poems_list,
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find occurances with given metaphor
app.post("/findWithMetaphor", async (req, res) => {
  const met_terms = req.body.met_terms;
  console.log(met_terms);

  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      body: {
        query: {
          bool: {
            should: {
              match: {
                metaphorical_terms: met_terms,
              },
            },
          },
        },
      },
    });
    res.json(response.hits.hits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find summary of information about poem
app.post("/findWithPoem", async (req, res) => {
  const poem = req.body.poem;
  console.log(poem);

  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  poem_name: poem,
                },
              },
            ],
          },
        },
        aggs: {
          group_by_poem_index: {
            terms: {
              field: "poem_index",
              size: 4,
            },
            aggs: {
              lines: {
                top_hits: {
                  size: 4,
                },
              },
            },
          },
        },
      },
    });

    result = response.hits.hits;

    if (poem == "") {
      res.json({
        poem_name: "",
        poet: "",
        poem_lines: [],
      });
    } else {
      const poem_lines = [];

      result.forEach((element) => {
        poem_lines.push(element._source.line);
      });
      res.json({
        poem_name: result[0]._source.poem_name,
        poet: result[0]._source.poet,
        poem_lines: poem_lines,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate combined query with the usage of filters
function generateElasticsearchQueryWithFilters(poem, met_terms, poet) {
  must_queries = [];

  if (poem.length > 0) {
    must_queries.push({
      match: {
        poem_name: poem,
      },
    });
  }

  if (met_terms.length > 0) {
    must_queries.push({
      match: {
        metaphorical_terms: met_terms,
      },
    });
  }

  if (poet.length > 0) {
    must_queries.push({
      match: {
        poet: poet,
      },
    });
  }

  must_queries.push({
    range: {
      metaphor_count: {
        gt: 0,
      },
    },
  });

  const query = {
    bool: {
      must: must_queries,
    },
  };

  return query;
}

// Find with applying filters
app.post("/searchWithFilters", async (req, res) => {
  console.log(req.body);
  const { poem, met_terms, poet } = req.body;
  console.log(poem);
  console.log(met_terms);
  console.log(poet);

  const query = generateElasticsearchQueryWithFilters(poem, met_terms, poet);
  console.log("Test");
  console.log(query.bool.must);
  try {
    const response = await req.app.locals.elasticClient.search({
      index: "sinhala_metaphors",
      body: {
        query: query,
      },
    });

    result = response.hits.hits;

    results_out = [];
    result.forEach((element) => {
      results_out.push({
        poem: element._source["poem_name"],
        poet: element._source["poet"],
        metaphor: element._source["metaphorical_terms"],
      });
    });

    res.json(results_out);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
