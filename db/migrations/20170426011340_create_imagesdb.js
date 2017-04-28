
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('imagesdb', function(table){
      table.increments('id').primary();
      table.string('url');
      table.integer('views');
      table.string('photog');
      table.float('lat');
      table.float('lon');
      table.string('neighbourhood');
      table.string('locality');
      table.string('region');
      table.string('country');
      table.float('score1');
      table.integer('red1');
      table.integer('green1');
      table.integer('blue1');
      table.float('score2');
      table.integer('red2');
      table.integer('green2');
      table.integer('blue2');
      table.float('score3');
      table.integer('red3');
      table.integer('green3');
      table.integer('blue3');
      table.float('score4');
      table.integer('red4');
      table.integer('green4');
      table.integer('blue4');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('imagesdb')
  ])
};
