
exports.seed = function(knex, Promise) {
  return knex('likesdb')
    .then(function () {
      return Promise.all([
        knex('likesdb').insert({imagesid: 1, usersid: 1}),
        knex('likesdb').insert({imagesid: 2, usersid: 1}),
        knex('likesdb').insert({imagesid: 3, usersid: 1}),
        knex('likesdb').insert({imagesid: 4, usersid: 2}),
        knex('likesdb').insert({imagesid: 5, usersid: 2}),
        knex('likesdb').insert({imagesid: 6, usersid: 2}),
        knex('likesdb').insert({imagesid: 7, usersid: 2}),
        knex('likesdb').insert({imagesid: 8, usersid: 3}),
        knex('likesdb').insert({imagesid: 9, usersid: 3}),
        knex('likesdb').insert({imagesid: 10, usersid: 3}),
        knex('likesdb').insert({imagesid: 11, usersid: 3}),
        knex('likesdb').insert({imagesid: 12, usersid: 3}),
      ]);
    });
};
