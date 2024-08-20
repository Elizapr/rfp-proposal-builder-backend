/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable("user", (table) => {
            table.string("id").primary();
            table.string("email").notNullable();
            table.string("password").notNullable();
            table.string("contact").notNullable().defaultTo("");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("company", (table) => {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("industry").notNullable();
            table.string("founded").notNullable();
            table.string("city").notNullable();
            table.string("state").notNullable();
            table.string("country").notNullable();
            table.string("background", 1000).notNullable().defaultTo("");
            table.string("user_id")
                .references("user.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("employee", (table) => {
            table.increments("id").primary();
            table.string("full_name").notNullable();
            table.string("job_title").notNullable();
            table.integer("experience_years").notNullable().defaultTo(0);
            table.string("skills", 1000).notNullable().defaultTo("");
            table.integer("company_id")
                .unsigned()
                .references("company.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("employee").dropTable("company").dropTable("user");
}
