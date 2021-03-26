let gMapsIframeSrc = 'https://www.google.com/maps/d/embed?mid=' + gMaps[5].id + '=ru&z=' + gMaps[5].zoom;
// let powerBiIframeSrc = "https://app.powerbi.com/view?r=eyJrIjoiMDU5ZDE2MDAtMTI2OC00ZjgxLWI1ZjEtNGRkODU0YTQwZjk1IiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9";
let powerBiIframeSrc = "https://app.powerbi.com/view?r=eyJrIjoiMDU5ZDE2MDAtMTI2OC00ZjgxLWI1ZjEtNGRkODU0YTQwZjk1IiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9";

let iframeWidth = '100%';
let iframeHeight = '100%';

function embedGMap() {
  let iframe = document.createElement('iframe');
  document.getElementById('embedded-map-canvas').appendChild(iframe);
  iframe.width = iframeWidth;
  iframe.height = iframeHeight;
  iframe.src = gMapsIframeSrc;
}
embedGMap();
