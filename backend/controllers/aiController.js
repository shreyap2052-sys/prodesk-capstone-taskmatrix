const OpenAI = require("openai");

const generateTask = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI service is currently unavailable",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { taskIdea } = req.body;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `
You are an AI productivity assistant for a project management app.

Convert this task idea into a structured task:

${taskIdea}

Return:
1. A clear task title
2. A detailed description
3. 3 to 5 useful subtasks
4. Suggested priority: low, medium, or high

Keep the response practical and concise.
`,
    });

    return res.status(200).json({
      success: true,
      message: "AI task generated successfully",
      result: response.output_text,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("AI generation failed:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI task",
    });
  }
};

module.exports = { generateTask };
