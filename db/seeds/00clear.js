exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('imagesdb').del(),
    knex('usersdb').del()
  ])
};
