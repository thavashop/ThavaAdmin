// (function ($) {
//   "use strict"

//   //Line Interpolation / Smoothing
//   var chart = new Chartist.Line('#line-smoothing', {
//     labels: [1, 2, 3, 4, 5],
//     series: [

//       [10, 15, 0, 1, 2]
//     ]
//   }, {
//     // Remove this configuration to see that chart rendered with cardinal spline interpolation
//     // Sometimes, on large jumps in data values, it's better to use simple smoothing.
//     lineSmooth: Chartist.Interpolation.simple({
//       divisor: 2
//     }),
//     fullWidth: true,
//     chartPadding: {
//       right: 20
//     },
//     low: 0,
//     plugins: [
//       Chartist.plugins.tooltip()
//     ]
//   });

// })(jQuery);