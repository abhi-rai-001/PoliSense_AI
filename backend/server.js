import express, { urlencoded } from 'express';
import 'dotenv/config';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({extended:true}));
app.post('/query', async (req, res) => {
  const { fileContent, query } = req.body;

  // Here we’ll call LLM
  // TODO: Process fileContent and query
  console.log('Received query:', query);
  console.log('File content length:', fileContent?.length || 0);

  res.json({
    decision: 'Approved',
    amount: 150000,
    justification: 'Clause 4.3: Knee surgery covered under this policy.',
  });
});

const PORT = process.env.PORT;

app.listen(PORT,(req,res)=>{
    console.log('Listening on port ' , PORT)
})
