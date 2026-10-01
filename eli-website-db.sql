
DROP TABLE IF EXISTS "users"; -- <-- DIESE ZEILE GANZ OBEN HINZUFÜGEN!

PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "users" (
  PersonID int PRIMARY KEY,
  LastName varchar(255) NOT NULL,
  FirstName varchar(255),
  Address varchar(255),
  City varchar(255),
  Email varchar(255), 
  Password varchar(255));
