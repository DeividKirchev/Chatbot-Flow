const client = require("./setup");

const getResponse = async (input, instructions, model = "gpt-4o") => {
  const response = await client.responses.create({
    model: model,
    instructions: instructions,
    input: input,
  });
  return response.output_text;
};

module.exports = getResponse;
