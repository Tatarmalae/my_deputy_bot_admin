const koaBody = require('koa-body');
const Router = require('koa-router');

const logger = require('../errorHandler');
const pool = require('../mysqlPool');

const router = new Router();

router
  .get('/add_address', async () => {
    const addressJson = require('../address.json');

    const connectAddress = pool.connectAddress;

    for (let i = 0; i < addressJson.length; i++) {

      const addressData = {
        pp_number: addressJson[i]['№ п/п'],
        country: addressJson[i]['Округ'],
        uik: addressJson[i]['УИК'],
        full_name: addressJson[i]['Ф.И.О. депутата'],
        position: addressJson[i]['Должность, место работы'],
        receives: addressJson[i]['Ведет прием:'],
        address: addressJson[i]['Адрес:'],
        phone: addressJson[i]['Телефон:'],
        email: addressJson[i]['E-mail:'],
        more_about_deputy: addressJson[i]['Подробнее о депутате:']
      };
      connectAddress.query(
        `INSERT INTO address
         SET ?`, addressData,
        (err) => {
          if (err) logger.logError(err.message);
        }
      );
    }
  })
  .get('/add_party', async () => {
    const partyJson = require('../party.json');

    const connectParty = pool.connectParty;

    for (let i = 0; i < partyJson.length; i++) {

      const partyData = {
        pp_number: partyJson[i]['№ п/п'],
        country: partyJson[i]['Округ'],
        full_name: partyJson[i]['Ф.И.О. депутата'],
        position: partyJson[i]['Должность, место работы'],
        receives: partyJson[i]['Ведет прием:'],
        address: partyJson[i]['Адрес:'],
        phone: partyJson[i]['Телефон:'],
        more_about_deputy: partyJson[i]['Подробнее о депутате:']
      };
      connectParty.query(
        `INSERT INTO party
         SET ?`, partyData,
        (err) => {
          if (err) logger.logError(err.message);
        }
      );
    }
  })
  .get('/api/address/', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));

    let addressInfo = [];
    const connectAddress = pool.connectAddress;
    await connectAddress.promise().query(
      `SELECT *
       FROM address ORDER BY -id LIMIT 30`
    ).then(([rows]) => {
      rows.forEach(item => {
        addressInfo.push(JSON.parse(JSON.stringify(item)));
      });
      ctx.body = addressInfo;
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      logger.logError(err.message);
    });
  })
  .put('/api/address/:id', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));

    const id = ctx.params.id;

    const connectAddress = pool.connectAddress;
    await connectAddress.promise().query(
      `UPDATE address SET ? WHERE id=${id}`, ctx.body
    ).then(() => {
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      logger.logError(err.message);
    });
  })
  .delete('/api/address/:id', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));

    const id = ctx.params.id;

    const connectAddress = pool.connectAddress;
    await connectAddress.promise().query(
      `DELETE FROM address WHERE id=${id}`, ctx.body
    ).then(() => {
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      logger.logError(err.message);
    });
  })
  .post('/api/address/', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));
    const connectAddress = pool.connectAddress;

    connectAddress.query(
      `INSERT INTO address
         SET ?`, ctx.body,
      (err) => {
        if (err) logger.logError(err.message);
      }
    );
  })

  .get('/api/units/', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));

    let addressInfo = [];
    const connectAddress = pool.connectAddress;
    await connectAddress.promise().query(
      `SELECT *
       FROM party ORDER BY id`
    ).then(([rows]) => {
      rows.forEach(item => {
        addressInfo.push(JSON.parse(JSON.stringify(item)));
      });
      ctx.body = addressInfo;
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      logger.logError(err.message);
    });
  })
  .put('/api/units/:id', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));

    const id = ctx.params.id;

    const connectAddress = pool.connectAddress;
    await connectAddress.promise().query(
      `UPDATE party SET ? WHERE id=${id}`, ctx.body
    ).then(() => {
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      logger.logError(err.message);
    });
  })
  .delete('/api/units/:id', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));

    const id = ctx.params.id;

    const connectAddress = pool.connectAddress;
    await connectAddress.promise().query(
      `DELETE FROM party WHERE id=${id}`, ctx.body
    ).then(() => {
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      logger.logError(err.message);
    });
  })
  .post('/api/units/', koaBody(), async (ctx) => {
    ctx.body = JSON.parse(JSON.stringify(ctx.request.body));
    const connectAddress = pool.connectAddress;

    connectAddress.query(
      `INSERT INTO party
         SET ?`, ctx.body,
      (err) => {
        if (err) logger.logError(err.message);
      }
    );
  });

module.exports = router;