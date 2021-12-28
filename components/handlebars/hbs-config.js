// hbs helpers
const hbs = require('hbs')
hbs.registerHelper('equals', function (v1, v2) {
  return v1 == v2;
});
hbs.registerHelper('inc', (v) => v+1)
hbs.registerHelper('dec', (v) => v-1)
hbs.registerHelper('in', (v, pool) => pool.includes(v))
hbs.registerPartials('./components/handlebars/views/partials', (err) => {if (err) console.log(err)})