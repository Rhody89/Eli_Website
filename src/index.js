export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Beispiel: Ein API-Endpunkt, der Daten aus D1 liest
    if (url.pathname === "/api/users") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM users LIMIT 10"
      ).all();
      return Response.json(results);
    }

    // Für alle anderen Anfragen: Lade die statischen Assets (z.B. index.html)
    return await env.ASSETS.fetch(request);
  },
};