let express = require('express');
let index = require('./routes/index');
let user = require('./routes/user');
let app = express();
app.use('/',index);
app.use('/user',user);
app.listen(8000);
