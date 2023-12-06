const express = require('express');
const cors = require('cors'); 
const query = require('./query');

const app = express();
const port = 3000;

app.use(cors());

app.get('/query', async (req, res) => {
    try {
      let result;
      const type = req.query.type;
      if (type === '1') 
      {
        result = await query.query1();
      }
      else if (type === '2') 
      {
        result = await query.query2();
      }
      else if (type === '3') 
      {
        result = await query.query3();
      }
      else if (type === '3.1')
      {
        result = await query.query3p2();
      }
      else if (type === '4') 
      {
        result = await query.query4();
      }
      else if (type === '5.1') 
      {
        result = await query.query5p1();
      }
      else if (type === '5.2') 
      {
        result = await query.query5p2();
      }
      else if (type === '5.3') 
      {
        result = await query.query5p3();
      }
      else if (type === '5.4') 
      {
        result = await query.query5p4();
      }
      else if (type === '5.5') 
      {
        result = await query.query5p5();
      }
      else if (type === 'map')
      {
        result = await query.queryMap(req.query.year, req.query.month, req.query.day);
      } else if (type === 'tuple') {
        result = await query.tupleQuery();
      }
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
