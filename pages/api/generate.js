import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
I want you to be a devil's advocate for startup and project ideas.
Try to spot obvious issues with the startup or project idea. List a few issues.
Idea to test: 
`;
const generateAction = async (req, res) => {
    // Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.4,
        max_tokens: 500,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    console.log(basePromptOutput);

    const secondPromptPrefix = `
            I have an idea of a startup or project which I'd like to test: ${req.body.userInput}
            I see a few potential issues:
            ${basePromptOutput}
            How could I resolve mentioned issues and do you see any other issues?
            `;

    const finalCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: secondPromptPrefix,
        temperature: 0.5,
        max_tokens: 900,
    });

    const finalPromptOutput = finalCompletion.data.choices.pop();

    res.status(200).json({output: finalPromptOutput});
};

export default generateAction;