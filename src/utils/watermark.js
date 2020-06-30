const watermark = (
  canvasParams = {
    watermarkText: '请勿外传请勿外传',
    textAlign: 'center',
    textBaseline: 'middle',
    fillStyle: 'rgba(14, 184, 184, 0.2)',
    fontSize: '20',
    rotate: '30',
    width: 300,
    height: 150,
  },
) => {
  const {
    watermarkText = '请勿外传请勿外传',
    textAlign = 'center',
    textBaseline = 'middle',
    fillStyle = 'rgba(14, 184, 184, 0.2)',
    fontSize = '20',
    rotate = '30',
    width = 300,
    height = 150,
  } = canvasParams || {};
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  const ctx = canvas.getContext('2d');
  Object.assign(ctx, {
    textAlign,
    textBaseline,
    font: `${fontSize}px microsoft yahei`,
    fillStyle,
  });
  ctx.translate(parseFloat(width) / 2, parseFloat(height) / 2);
  ctx.rotate((Math.PI / 180) * rotate);
  ctx.translate(-parseFloat(width) / 2, -parseFloat(height) / 2);
  ctx.fillText(watermarkText, parseFloat(width) / 2, parseFloat(height) / 2);

  return canvas.toDataURL();
};

export default watermark;
