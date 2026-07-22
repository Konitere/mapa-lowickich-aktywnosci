
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Endpoint formularza
    if (url.pathname === "/api/submit" && request.method === "POST") {
      try {
        const { email, opis, link } = await request.json();

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: "mapalowickichaktywnosci@gmail.com",
            subject: "Nowe zgłoszenie wydarzenia",
            html: `
              <h2>Nowe zgłoszenie wydarzenia</h2>

              <p><strong>E-mail:</strong><br>${email}</p>

              <p><strong>Link:</strong><br>${link || "Nie podano"}</p>

              <p><strong>Opis:</strong></p>

              <div style="white-space:pre-wrap;border:1px solid #ddd;padding:15px;border-radius:8px">
                ${opis}
              </div>
            `,
          }),
        });

        if (!resendResponse.ok) {
          const error = await resendResponse.text();

          return Response.json(
            {
              success: false,
              error,
            },
            {
              status: 500,
            }
          );
        }

        return Response.json({
          success: true,
        });
      } catch (e) {
        return Response.json(
          {
            success: false,
            error: e.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    // Wszystkie pozostałe żądania obsługuje katalog public
    return env.ASSETS.fetch(request);
  },
};
