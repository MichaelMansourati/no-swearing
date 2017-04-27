
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('likesdb', function(table){
      table.increments('id').primary();
      table.integer('usersid').unsigned().references('id').inTable('usersdb').onDelete('CASCADE');
      table.integer('imagesid').unsigned().references('id').inTable('imagesdb').onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('likesdb')
  ])
};
