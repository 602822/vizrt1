const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());  

const port = 3000;
const { OpenAI } = require("openai");
require("dotenv").config();
app.use(express.json());
const cheerio = require("cheerio");
const axios = require("axios");

const systemPrompt = `You are a TV-Production expert who specialies in creating TV-Stories. Generate Tv-Stories in valid JSON-format from the data you are given, the stories should be realistic and the information should be accurate. The Story-object represent a TV-Story, a StoryItem-object represent a individual scene, a TV-Story contain one or more StoryItem-objects. The type attribute represent the type of the scene for example studio-camera, camera out in the field or prerecorded clip. The variant attribute represent which camera is being used, for example camera 1, camera 2 or camera 3. The bodytext attribute represents the script for the TV-anchors or reporter. Give all the objects a meaningful id. Create the scenes and scripts based on the data you are given. The storyPlannedDuration attribute is the sum of all the plannedDuration attributes in the StoryItem-objects. The plannedDuration attribute is the duration of the scene in seconds.
 Here are the interfaces you will need: export interface Rundown { id?: string | null, name?: string | null, stories?: Story[] | null } export interface Story { id?: string | null, storyPlannedDuration?: number, items?: StoryItem[] | null } export interface StoryItem { id?: string | null, type?: string | null, variant?: string | null, plannedDuration?: number, bodyText?: string | null }
`;
const systemPromptEditRundownTest = `You are a TV-Production expert who specialies in editing already exsisting TV-Rundowns. Your job is to edit the TV-Rundown you are given by making the changes the user requests, the Rundown should be in JSON-format. A Rundown contains one or more TV-stories. the TV-stories should be realistic and the information should be accurate. The Story-object represent a TV-Story, a StoryItem-object represent a individual scene, a TV-Story contain one or more StoryItem-objects. the type attribute represent the type of the scene for example studio-camera, camera out in the field or prerecorded clip. the variant attribute represent which camera is being used for example camera 1, camera 2 or camera 3, the bodytext attribute represents the script for the TV-anchors or reporter. Give all the objects a meaningful id. The storyPlannedDuration attribute is the sum of all the plannedDuration attributes in the StoryItem-objects. The plannedDuration attribute is the duration of the scene in seconds.
 The Rundown object we will give you are using these interfaces: { id?: string | null, name?: string | null, stories?: Story[] | null } export interface Story { id?: string | null, storyPlannedDuration?: number, items?: StoryItem[] | null } export interface StoryItem { id?: string | null, type?: string | null, variant?: string | null, plannedDuration?: number, bodyText?: string | null }
`;

const urlPattern = /https?:\/\/[^\s]+/g;
function containsValidURL(m) {
  return m.match(urlPattern) || [];
}

async function scrapeURLS(urls) {
  let textToUse = [];

  await Promise.all(
    urls.map(async (url) => {
      let { data } = await axios.get(url);
      let $ = cheerio.load(data);

      $("p").each((i, el) => {
        textToUse.push($(el).text());
      });
    })
  );

  let returnText = textToUse.join("\n").trim();
  return returnText;
}

app.post("/", async (req, res) => {

  console.log(req.body.message);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

  try {

    var message = req.body.message;
    
    const cURLS = containsValidURL(message);

    if (cURLS.length > 0) {
      const t = await scrapeURLS(cURLS);
      message = message.replaceAll(urlPattern, "");
      message += t;
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: message },
      ],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });

    console.log(completion.choices[0].message.content);

    res.json(JSON.parse(completion.choices[0].message.content, null, 2));

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "An error occurred." });

  }


});

app.post("/editRundown", async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    var message = req.body.message;
    const rundown = req.body.rundown;
    const cURLS = containsValidURL(message);

    if (cURLS.length > 0) {
      const t = await scrapeURLS(cURLS);
      message = message.replaceAll(urlPattern, "");
      message += t;
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPromptEditRundownTest,
        },
        {
          role: "user",
          content:
            message +
            "/n The rundown object to be edited: " +
            JSON.stringify(rundown),
        },
      ],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });

    res.json(JSON.parse(completion.choices[0].message.content, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = {
  app,
  scrapeURLS,
  containsValidURL,
};
