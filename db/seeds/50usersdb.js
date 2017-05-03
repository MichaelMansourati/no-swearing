exports.seed = function(knex, Promise) {
  return knex('usersdb')
    .then(function () {
      return Promise.all([
        knex('usersdb').insert({name: 'Michael', email: 'michael@m.com', password: '123456'}),
        knex('usersdb').insert({name: 'Suraj', email: 'suraj@s.com', password: '123456'}),
        knex('usersdb').insert({name: 'Joann', email: 'joann@j.com', password: '123456'}),
      ]);
    });
};
