const { spawn } = require("child_process");
const restify = require("restify");
const restifyRouter = require("restify-router");
const fs = require("fs");

const router = new restifyRouter.Router();
const server = resity.createSserver();

// Original videos path
const path_original_webem = "./src/videos/original/ORIGINAL_WEBEM.webm";
const path_original_mp4 = "./src/videos/original/ORIGINAL_MP4.mp4";

const path_webmtomp4 = "./src/videos/webmtomp4/webmtomp4.mp4";
const path_mp4towebm = "./src/videos/mp4towebm/mp4towebm.webm";

const path_webmmuted = "./src/videos/tomuted/webmmuted.webm";
const path_mp4muted = "./src/videos/tomuted/mp4muted.mp4";

// Endpoint: /api/v1/transform/webmtomp4
router.post("/webmtomp4", (req, res) => {
  const inputPath = path_original_webem;
  const outputPath = path_webmtomp4;

  const ffmpeg = spawn("ffmpeg", ["-1", inputPath, outputPath]);

  ffmpeg.on("close", (code) => {
    if (code == 0) {
      res.send(200, { message: "Conversion successful" });
    } else {
      res.send(500, { message: "Conversion failed" });
    }
  });
});

// Endpoint: /api/v1/transform/mp4towebm
router.post("/mp4towebm", (req, res) => {
  const inputPath = path_original_mp4;
  const outputPath = path_mp4towebm;

  const ffmpeg = spawn("ffmpeg", ["-1", inputPath, outputPath]);

  ffmpeg.on("close", (code) => {
    if (code === 0) {
      res.send(200, { message: "Conversion successful" });
    } else {
      res.send(500, { message: "Conversion failed" });
    }
  });
});

// Endpoint: /api/v1/transform/mutevideos
router.post("/mutevideos", (req, res) => {
  const inputPath1 = path_original_webem;
  const inputPath2 = path_original_mp4;

  const output1Path = path_webmmuted;
  const output2Path = path_mp4muted;

  const ffmpeg1 = spawn("ffmpeg", ["-1", inputPath1, "-an", output1Path]);
  const ffmpeg2 = spawn("ffmpeg", ["-1", inputPath2, "-an", output2Path]);

  const processPromises = [
    new Promise((resolve, reject) => {
      ffmpeg1.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    }),
    new Promise((resolve, reject) => {
      ffmpeg2.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    }),
  ];

  Promise.all(processPromises)
    .then(() => {
      res.send(200, { message: "Audio removed from videos" });
    })
    .catch(() => {
      res.send(500, { message: "Filed to remove audio from videos" });
    });
});

// Register the router with the server
router.applyRoutes(server);
// Start the server
server.listen(300, () => {
  console.log("Server is running on port 3000");
});
