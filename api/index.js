import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from '../config';

let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
  assert.equal(null, err);

  mdb = db;
});

const router = express.Router();

router.get('/contests', (req, res) => {
  let contests = {};
  mdb.collection('contests').find({})
     .project({
       id: 1,
       categoryName: 1,
       contestName: 1
     })
     .each((err, contest) => {
       assert.equal(null, err);
       if (!contest) {
         res.send({ contests });  //new more contests
         return;
       }
       contests[contest.id] = contest;
     });
});

router.get('/names/:nameIds', (req, res) => {
  const nameIds = req.params.nameIds.split(',').map(Number);
  let names = {};
  mdb.collection('names').find({ id: { $in:nameIds }})
     .each((err, name) => {
       assert.equal(null, err);
       if (!name) {
         res.send({ names });  //new more contests
         return;
       }
       names[name.id] = name;
     });
});

router.get('/contests/:contestId', (req, res) => {
  mdb.collection('contests')
     .findOne({ id: Number(req.params.contestId) })
     .then(contest=> res.send(contest))
     .catch(console.error);
});

export default router;




/*Using in memory data*/
// import express from 'express';
// import data from '../src/testData';
//
// const router = express.Router();
// const contests = data.contests.reduce((obj, contest) => {
//   obj[contest.id] = contest;
//   return obj;
// }, {});
//
// router.get('/contests', (req, res) => {
//   res.send({
//     contests: contests
//   });
// });
//
// router.get('/contests/:contestId', (req, res) => {
//   let contest = contests[req.params.contestId];
//   contest.description = 'asfsadgdg';
//   res.send(contest);
// });
//
// export default router;
