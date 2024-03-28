/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('conversations', (table) => {
            table.string('id').primary();
            table.string('title').notNullable().defaultTo('New Conversation');
            table.datetime('created_at').defaultTo(knex.fn.now());
            table.boolean('active').notNullable().defaultTo(true);
        })
        .createTable('messages', (table) => {
            table.increments('id').primary();
            table.integer('conversation_id').unsigned().references('id').inTable('conversations');
            table.string('sender').notNullable();
            table.string('content').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('messages')
        .dropTableIfExists('conversations');
};
