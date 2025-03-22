const client = require("./setup");

class OpenAIProcessor {
  constructor(instructions, model) {
    this.instructions = instructions;
    this.model = model;
  }

  async process(input) {
    const response = await client.responses.create({
      model: this.model,
      instructions: this.instructions,
      input: input,
    });
    return response.output_text;
  }
}

module.exports = OpenAIProcessor;
