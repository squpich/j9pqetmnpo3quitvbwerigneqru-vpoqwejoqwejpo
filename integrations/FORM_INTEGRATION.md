# Form integration

The website supports two modes controlled in `js/config.js`.

## Demo mode

```js
form: {
  mode: "demo",
  endpoint: ""
}
```

The form validates, simulates a short request and displays the success message.
No data leaves the browser.

## Live endpoint mode

```js
form: {
  mode: "endpoint",
  endpoint: "https://your-endpoint.example/contact",
  method: "POST"
}
```

The browser sends JSON:

```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+351...",
  "location": "Porto",
  "message": "...",
  "consent": "on"
}
```

The endpoint must:

- accept JSON POST requests;
- return an HTTP 2xx response on success;
- validate and sanitise all values server-side;
- protect against spam and abuse;
- send or store the lead securely.

Possible providers:

- Formspree;
- Netlify Functions;
- Supabase Edge Functions;
- Cloudflare Workers;
- custom API.
