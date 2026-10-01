import { WorkerEntrypoint } from "cloudflare:workers";
import { drizzle } from 'drizzle-orm/d1';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export default class extends WorkerEntrypoint {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Prüfen, ob die Anfrage an den Login-Pfad geht und ein POST ist
    if (url.pathname === '/api/login' && request.method === 'POST') 
    {
      return this.handleLogin(request)
    }

    if (url.pathname === '/api/register' && request.method === 'POST') 
    {
      return this.handleRegister(request)
    }

    // 2. Für alle anderen URLs: Statische Assets laden
    return await this.env.ASSETS.fetch(request);
  }

  async handleLogin(request) 
  {
    try 
      {
        // 1. Daten aus dem Frontend-Request auslesen
        const { email, password } = await request.json();

        // 2. Drizzle mit der D1-Datenbank verbinden
        const db = drizzle(this.env.DB);

        // 3. Benutzer in der D1-Datenbank suchen
        const foundUsers = await db
          .select()
          .from(users)
          .where(eq(users.Email, email))
          .limit(1);

        const user = foundUsers[0];

        console.log(user)
        console.log(email)
        console.log(password)

        // 4. Validierung (Existiert der User und stimmt das Passwort?)
        // HINWEIS: In Produktion hier 'crypto.subtle' oder eine Library für Passwort-Hashing nutzen!
        if (!user || user.Password !== password) {
          return new Response(
            JSON.stringify({ error: 'Ungültige Anmeldedaten' }), 
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // 5. Erfolg: Generiere z.B. einen JWT-Token oder eine Session
        return new Response(
          JSON.stringify({ success: true, token: "ein-sicherer-session-token" }), 
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } 
      catch (error) 
      {
        return new Response(JSON.stringify({ error: 'Serverfehler: ' + error.message }), 
                            { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
  }

  async handleRegister(request) 
  {
    try 
      {
        // 1. Daten aus dem Frontend-Request auslesen
        const {lastName, firstName, address, email, password} = await request.json();
        const city = ""
        console.log({lastName, firstName, address, email, password})

        // 2. Drizzle mit der D1-Datenbank verbinden
        const db = drizzle(this.env.DB);

        const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.Email, email))
        .limit(1);

        if (existingUser.length > 0) {
          return new Response(
            JSON.stringify({ error: 'Diese E-Mail-Adresse wird bereits verwendet' }), 
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // 3. Benutzer in der D1-Datenbank suchen
        await db.insert(users).values(
          {
            LastName: lastName,
            FirstName: firstName,
            Address: address,
            City: city, 
            Email: email,
            Password: password
          }
        )

        // 4. Validierung (Existiert der User und stimmt das Passwort?)

        // 5. Erfolg: Generiere z.B. einen JWT-Token oder eine Session
        return new Response(
          JSON.stringify({ success: true, token: "ein-sicherer-session-token" }), 
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } 
      catch (error) 
      {
        return new Response(JSON.stringify({ error: 'Serverfehler: ' + error.message }), 
                            { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
  }
};