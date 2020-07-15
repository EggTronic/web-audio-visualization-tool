/**
 * @description
 * Render background image.
 * It returns a promise - for async hook
 */
export const renderBackgroundImg = (avCtx) => {
  const loadImages = (srcs) => {
    let promises = [];
    srcs.forEach(src => {
      promises.push(
        new Promise((resolve, reject) => {
          const img = new Image();
          img.addEventListener("load", () => resolve(img));
          img.addEventListener("error", err => reject(err));
          img.src = src;
        }))
    })
    return promises
  };

  let srcs = [
    "https://i.ibb.co/3WHwzQY/ring.png",
    "https://i.ibb.co/Kzfkqd6/wing.png",
    "https://i.ibb.co/wMgscY1/volume.png"
  ];

  // options for each image
  // [alpha, x, y, width, height]
  let options = [
    [0.9, 500, 140, 200, 200],
    [0.6, 0, 360, 1200, 300],
    [1, 470, 730, 20, 20]
  ]

  return Promise.all(loadImages(srcs))
    .then(imgs => {
      let cx = avCtx.canvas.width / 2;
      let cy = avCtx.canvas.height / 2;

      avCtx.canvasStaticCtx.beginPath();
      avCtx.canvasStaticCtx.globalAlpha = 0.12;
      avCtx.canvasStaticCtx.fillStyle = "black";
      avCtx.canvasStaticCtx.arc(cx, cy, 380, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasStaticCtx.fill();
      avCtx.canvasStaticCtx.closePath();

      avCtx.canvasStaticCtx.beginPath();
      avCtx.canvasStaticCtx.globalAlpha = 0.05;
      avCtx.canvasStaticCtx.fillStyle = "red";
      avCtx.canvasStaticCtx.arc(cx, cy, 280, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasStaticCtx.fill();
      avCtx.canvasStaticCtx.closePath();

      avCtx.canvasStaticCtx.beginPath();
      avCtx.canvasStaticCtx.globalAlpha = 0.4;
      avCtx.canvasStaticCtx.fillStyle = "black";
      avCtx.canvasStaticCtx.arc(cx, cy, 90, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasStaticCtx.fill();
      avCtx.canvasStaticCtx.closePath();
      avCtx.canvasStaticCtx.globalAlpha = 1;

      imgs.forEach((img, index) => {
        avCtx.canvasStaticCtx.globalAlpha = options[index][0];
        avCtx.canvasStaticCtx.drawImage(
          img,
          options[index][1],
          options[index][2],
          options[index][3],
          options[index][4],
        );
      })
    })
    .catch(err => {
      throw Error("failed to load image: " + err);
    });
};