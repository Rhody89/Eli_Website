import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint {
  // WICHTIG: Das Wort "async" MUSS hier vor "fetch" gelöscht werden!
  fetch(request) {
    // Da fetch nicht mehr async ist, lagern wir die asynchrone Logik
    // in eine separate Hilfsfunktion aus, damit "this" perfekt funktioniert.
    return this.handleRequest(request);
  }

  async handleRequest(request) {
    const url = new URL(request.url);

    // 1. API-Endpunkt abfangen
    if (url.pathname === "/api/users") {
      // "this.env" ist jetzt garantiert voll einsatzbereit!
      const { results } = await this.env.DB.prepare(
        "SELECT * FROM users LIMIT 10"
      ).all();
      return Response.json(results);
    }

    // 2. Für alle anderen URLs: Statische Assets laden
    return await this.env.ASSETS.fetch(request);
  }
}
