const chai = require('chai');

const propfilter = '-_id -__v';
// module.exports = () => {

// }
// common js

// import chai from 'chai';
// export default () => {

// };
// ES6 import

function convertPiece(piece) {
  const convert = { x: piece[0], y: piece[1], userid: piece[2] };
  return convert;
}

function convertComparisonResult(result) {
  // var count = 0;
  const pieces = [];
  const bsize = result.size;
  const bpieces = result.bord;
  for (let i = 0; i < bpieces.length; i += 1) {
    if (bpieces[i] !== 0) {
      const piece = {
        x: Math.floor(i % bsize),
        y: Math.floor(i / bsize),
        userid: bpieces[i],
      };
      pieces.push(piece);
    }
  }
  return pieces;
}

const app = require('../../../../../src/routes/app.js');
const PieceModel = require('../../../../../src/models/kido_k/PieceModel.js');
const {
  prepareDB,
  deleteAllDataFromDB,
} = require('../../../../../src/utils/db.js');

const basePath = '/api/v1';

describe('play', () => {
  beforeAll(prepareDB);
  afterEach(deleteAllDataFromDB);

  it('put a piece', async () => {
    // Given
    const pieces = [ // pieces = [x,y,userid]
      [0, 0, 1],
    ];

    const result = {
      size: 2, // set width of bord
      bord: [ // set correct answer
        1, 0,
        0, 0,
      ],
    };

    // When
    let response;
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = convertPiece(pieces[i]);
      response = await chai.request(app)
        .post(`${basePath}/kido_k/piece`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(piece);
    }

    // Then
    const rpieces = convertComparisonResult(result);
    expect(response.body).toHaveLength(rpieces.length);
    expect(response.body).toEqual(expect.arrayContaining(rpieces));

    const pieceData = JSON.parse(JSON.stringify(await PieceModel.find({}, propfilter)));
    expect(pieceData).toHaveLength(rpieces.length);
    expect(pieceData).toEqual(expect.arrayContaining(rpieces));
  });


  it('sets multi pieces', async () => {
    // Given
    const pieces = [ // pieces = [x,y,userid]
      [0, 0, 1],
      [1, 0, 2],
    ];

    const result = {
      size: 2, // set width of bord
      bord: [ // set correct answer
        1, 2,
        0, 0,
      ],
    };

    // When
    let response;
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = convertPiece(pieces[i]);
      response = await chai.request(app)
        .post(`${basePath}/kido_k/piece`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(piece);
    }

    // Then
    const rpieces = convertComparisonResult(result);
    expect(response.body).toHaveLength(rpieces.length);
    expect(response.body).toEqual(expect.arrayContaining(rpieces));

    const pieceData = JSON.parse(JSON.stringify(await PieceModel.find({}, propfilter)));
    expect(pieceData).toHaveLength(rpieces.length);
    expect(pieceData).toEqual(expect.arrayContaining(rpieces));
  });

  // 同じとFころにおけないテスト
  it('sets pieces same space', async () => {
    // Given
    const pieces = [ // pieces = [x,y,userid]
      [0, 0, 1],
      [1, 0, 2],
      [1, 0, 1],
    ];

    const result = {
      size: 2, // set width of bord
      bord: [ // set correct answer
        1, 2,
        0, 0,
      ],
    };

    // When
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = convertPiece(pieces[i]);
      response = await chai.request(app)
        .post(`${basePath}/kido_k/piece`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(piece);
    }

    // Then
    // check express result
    const rpieces = convertComparisonResult(result);
    expect(response.body).toHaveLength(rpieces.length);
    expect(response.body).toEqual(expect.arrayContaining(rpieces));

    // check mongoDB result
    const pieceData = JSON.parse(JSON.stringify(await PieceModel.find({}, propfilter)));
    expect(pieceData).toHaveLength(rpieces.length);
    expect(pieceData).toEqual(expect.arrayContaining(rpieces));
  });

  // 挟んだらめくれるテスト part1
  it('turn over piece about right and down', async () => {
    // Given
    const pieces = [ // pieces = [x,y,userid]
      [0, 0, 1],
      [1, 0, 2],
      [2, 0, 1],
      [0, 1, 2],
      [0, 2, 1],
    ];

    const result = {
      size: 3, // set width of bord
      bord: [ // set correct answer
        1, 1, 1,
        1, 0, 0,
        1, 0, 0,
      ],
    };

    // When
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = convertPiece(pieces[i]);
      response = await chai.request(app)
        .post(`${basePath}/kido_k/piece`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(piece);
    }

    // Then
    // check express result
    const rpieces = convertComparisonResult(result);
    expect(response.body).toHaveLength(rpieces.length);
    expect(response.body).toEqual(expect.arrayContaining(rpieces));

    // check mongoDB result
    const pieceData = JSON.parse(JSON.stringify(await PieceModel.find({}, propfilter)));
    expect(pieceData).toHaveLength(rpieces.length);
    expect(pieceData).toEqual(expect.arrayContaining(rpieces));
  });

  // 挟んだらめくれるテスト part2
  it('turn over piece about left and up', async () => {
    // Given
    const pieces = [ // pieces = [x,y,userid]
      [2, 2, 1],
      [1, 2, 2],
      [0, 2, 1],
      [2, 1, 2],
      [2, 0, 1],
    ];

    const result = {
      size: 3, // set width of bord
      bord: [ // set correct answer
        0, 0, 1,
        0, 0, 1,
        1, 1, 1,
      ],
    };

    // When
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = convertPiece(pieces[i]);
      response = await chai.request(app)
        .post(`${basePath}/kido_k/piece`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(piece);
    }

    // Then
    // check express result
    const rpieces = convertComparisonResult(result);
    expect(response.body).toHaveLength(rpieces.length);
    expect(response.body).toEqual(expect.arrayContaining(rpieces));

    // check mongoDB result
    const pieceData = JSON.parse(JSON.stringify(await PieceModel.find({}, propfilter)));
    expect(pieceData).toHaveLength(rpieces.length);
    expect(pieceData).toEqual(expect.arrayContaining(rpieces));
  });
});