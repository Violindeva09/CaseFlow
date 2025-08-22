const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

const indexRouter = require('./app_server/routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});