const request = require("supertest");
const { app, scrapeURLS, containsValidURL } = require("../index");

//The tests are written using Jest and Supertest
//Please run the tests one at a time
//Run the tests using npm test
//Run the tests one at a time with it.only or npm test -- --testNamePattern='One link should return one story in the rundown'

//Example of a Rundown object with one story
//Used to test the editRundown endpoint
const jsonObject = {
  id: "news_broadcast_20230405",
  name: "Kveldsnyhetene 5. april 2023",
  stories: [
    {
      id: "story_hadia_tajik_decision",
      storyPlannedDuration: 260,
      items: [
        {
          id: "storyitem_intro",
          type: "studio-camera",
          variant: "camera 1",
          plannedDuration: 20,
          bodyText:
            "God kveld, og velkommen til kveldsnyhetene. Vår toppsak i kveld: Hadia Tajik, nestleder i Arbeiderpartiet og tidligere arbeidsminister, har kunngjort at hun ikke vil søke renominasjon for neste stortingsperiode. Vi følger denne uventede utviklingen i norsk politikk.",
        },
        {
          id: "storyitem_tajik_facebook_statement",
          type: "prerecorded-clip",
          variant: "clip 1",
          plannedDuration: 60,
          bodyText:
            "Tidligere i dag la Tajik ut en beskjed på sin Facebook-side, hvor hun detaljert beskriver sin vei fra oppveksten i Rogaland til det nasjonale politiske landskapet, og hva som ligger bak beslutningen om ikke å fortsette i Stortinget etter 2025-valget.",
        },
        {
          id: "storyitem_studio_reaction",
          type: "studio-camera",
          variant: "camera 2",
          plannedDuration: 30,
          bodyText:
            "Reaksjonene har ikke latt vente på seg. Ap-leder og statsminister Jonas Gahr Støre ga uttrykk for respekt for Tajiks avgjørelse gjennom en SMS til VG, hvor han også takker henne for hennes tid i partiet og ønsker henne lykke til videre.",
        },
        {
          id: "storyitem_field_report_background",
          type: "camera-out-field",
          variant: "camera 1",
          plannedDuration: 90,
          bodyText:
            "Vår politiske reporter er i dag i Oslo, hvor Hadia Tajik for fremtiden vil tilbringe mer tid med familien. Her reflekterer lokalbefolkningen over Tajiks arbeid og hennes beslutning om å ikke stå på Rogaland Arbeiderpartiets liste for neste valg. Mange er overrasket, og noen spekulerer i hennes fremtidige karrieresteg.",
        },
        {
          id: "storyitem_studio_future_speculation",
          type: "studio-camera",
          variant: "camera 3",
          plannedDuration: 60,
          bodyText:
            "Hva betyr dette for Arbeiderpartiet, og hvem vil kunne fylle tomrommet etter Tajik i Rogaland? Mens partiet kanskje ser på mulige erstatninger, snakker vi også med politiske analytikere som gir sine spådommer om Tajiks mulige veier etter 2025, enten i politikkens verden eller i en helt ny retning.",
        },
      ],
    },
  ],
};

describe("Testing our REST-API", () => {
  it("One link should return one story in the rundown", async () => {
    const response = await request(app).post("/createRundown").send({
      message:
        "Create TV-stories about these topics: https://www.vg.no/rampelys/i/KnOoGG/kongen-faar-pacemaker-i-dag",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.stories.length).toBe(1);
  }, 120000); //vent 2 minutter på svar før testen feiler

  it("Test that the plannedDuration of a Story is equal to the duration of all the scenes", async () => {
    const response = await request(app).post("/createRundown").send({
      message:
        "Create TV-stories about these topics: https://www.vg.no/rampelys/i/KnOoGG/kongen-faar-pacemaker-i-dag",
    });
    expect(response.statusCode).toBe(200);
    let durationOfAllScenes = 0;
    response.body.stories[0].items.forEach((storyItem) => {
      durationOfAllScenes += storyItem.plannedDuration;
    });
    expect(response.body.stories[0].storyPlannedDuration).toBe(
      durationOfAllScenes
    );
  }, 120000);
  //The links need to be about different topics for the test to pass
  it("Amount of stories should equal amount of linked articles", async () => {
    const message =
      "Create TV-stories about these topics: https://www.vg.no/nyheter/innenriks/i/rl0l8l/zaniar-matapour-i-retten-flere-forklarer-seg https://www.vg.no/nyheter/i/O8L8Vw/hadia-tajik-takker-nei-til-gjenvalg-til-stortinget-skriver-hun-paa-facebook";
    const response = await request(app).post("/createRundown").send({
      message,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.stories.length).toBe(containsValidURL(message).length);
  }, 120000);

  it("Check if number of detected urls in prompt is correct", async () => {
    const message =
      "Create TV-stories about these topics: https://www.vg.no/rampelys/i/KnOoGG/kongen-faar-pacemaker-i-dag https://www.vg.no/nyheter/innenriks/i/KnQzVE/alvorlig-trafikkulykke-i-moere-og-romsdal";
    expect(containsValidURL(message).length).toBe(2);
  });

  it("Check if duration increases by the given amount", async () => {
    const response = await request(app).post("/editRundown").send({
      message: "Double the duration of the rundown",
    });
    expect(response.statusCode).toBe(200);
    let durationOfAllScenes = 0;
    response.body.stories[0].items.forEach((storyItem) => {
      durationOfAllScenes += storyItem.plannedDuration;
    });
    expect(response.body.stories[0].storyPlannedDuration).toBe(
      durationOfAllScenes
    );
    expect(response.body.stories[0].storyPlannedDuration).toBe(
      jsonObject.stories[0].storyPlannedDuration * 2
    );
  }, 120000);

  it.only("Test adding a Story to the Rundown", async () => {
    const rundownLength = jsonObject.stories.length;
    expect(rundownLength).toBe(1);

    const response = await request(app).post("/editRundown").send({
      message:
        "Add a TV-Story about this topic: https://www.vg.no/nyheter/i/0QeE9A/5000-leger-i-undersoekelse-usikre-paa-fremtiden-i-yrket",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.stories.length).toBe(2);
  }, 120000); //vent 2 minutter på svar før testen feiler

  it("Test changing camera of a scene", async () => {
    const response = await request(app).post("/editRundown").send({
      message: "Change the camera of the last scene to camera 1",
    });
    expect(response.statusCode).toBe(200);
    expect(
      response.body.stories[0].items[response.body.stories[0].items.length - 1]
        .variant
    ).toBe("camera 1");
  }, 120000);

  it("Test Deleting a scene from a Story in the Rundown", async () => {
    const response = await request(app).post("/editRundown").send({
      message: "Delete the first scene from the Story in the Rundown",
    });
    const numberOfScenes = jsonObject.stories[0].items.length;

    expect(response.statusCode).toBe(200);
    expect(response.body.stories[0].items.length).toBe(numberOfScenes - 1);
  }, 120000); //vent 2 minutter på svar før testen feiler

  it("Test Deleting a scene by id from a Story in the Rundown", async () => {
    let sceneFound = false;
    jsonObject.stories[0].items.forEach((scene) => {
      if (scene.id === "storyitem_field_report_background") {
        sceneFound = true;
      }
    });

    expect(sceneFound).toBe(true);

    const response = await request(app).post("/editRundown").send({
      message: "Delete the scene with id storyitem_field_report_background",
    });
    const numberOfScenes = jsonObject.stories[0].items.length;

    expect(response.statusCode).toBe(200);
    expect(response.body.stories[0].items.length).toBe(numberOfScenes - 1);

    let foundScene = false;
    response.body.stories[0].items.forEach((scene) => {
      if (scene.id === "storyitem_field_report_background") {
        foundScene = true;
      }
    });
    expect(foundScene).toBe(false);
  }, 120000); //vent 2 minutter på svar før testen feiler
});
