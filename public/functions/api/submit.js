
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();

    const email = data.email || "";
    const opis = data.opis || "";
    const link = data.link || "";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "mapalowickichaktywnosci@gmail.com",
        subject: "Nowe zgłoszenie wydarzenia",
        html: `
          <div style="font-family:Arial,sans-serif;font-size:15px">
            <h2>Nowe zgłoszenie wydarzenia</h2>

            <p><strong>E-mail zgłaszającego:</strong><br>${email}</p>

            <p><strong>Link do wydarzenia:</strong><br>${
              link || "Nie podano"
            }</p>

            <p><strong>Opis wydarzenia:</strong></p>

            <div style="
              border:1px solid #ddd;
              padding:15px;
              border-radius:8px;
              white-space:pre-wrap;
            ">
              ${opis}
            </div>

            <hr>

            <p style="color:#777">
              Wiadomość została wysłana z formularza
              Mapy Łowickich Aktywności.
            </p>

          </div>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();

      return new Response(
        JSON.stringify({
          success: false,
          error
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
}
