
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('imagesdb', function(table){
      table.increments('id').primary();
      table.string('url');
      table.integer('views');
      table.json('geo');
      table.json('c1');
      table.json('c2');
      table.json('c3');
      table.json('c4');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('imagesdb')
  ])
};
