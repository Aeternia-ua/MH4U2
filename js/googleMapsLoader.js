// let powerBiIframeSrc = "https://app.powerbi.com/view?r=eyJrIjoiMDU5ZDE2MDAtMTI2OC00ZjgxLWI1ZjEtNGRkODU0YTQwZjk1IiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9";


function embedGMap(src) {
  let iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.src = src;
  let canvas = document.createElement('div');
      canvas.setAttribute('id', 'embedded-map-canvas');
      canvas.appendChild(iframe);
      return canvas;
}
