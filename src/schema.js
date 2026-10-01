import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Hier definieren wir deine "users"-Tabelle für die D1-Datenbank
export const users = sqliteTable('users', {
  PersonID: integer('PersonID').primaryKey(),
  LastName: text('LastName').notNull().unique(),
  FirstName: text('FirstName'),
  Address: text('Address'),
  City: text('City'),
  Email: text('Email'),
  Password: text('Password') // Hinweis: Später Hashes statt Klartext nutzen!
});