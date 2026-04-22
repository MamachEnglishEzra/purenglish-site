export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const errorParam = url.searchParams.get('error');

  if (errorParam) {
    return oauthErrorPage(url.searchParams.get('error_description') || errorParam);
  }

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  let tokenData;
  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: env.OAUTH_CLIENT_ID,
        client_secret: env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });
    tokenData = await resp.json();
  } catch (err) {
    return oauthErrorPage('Failed to contact GitHub: ' + err.message);
  }

  if (tokenData.error) {
    return oauthErrorPage(tokenData.error_description || tokenData.error);
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });
  const message = 'authorization:github:success:' + payload;

  return new Response(
    `<!DOCTYPE html><html><body><script>
(function () {
  var msg = ${JSON.stringify(message)};
  function receive(e) {
    window.opener.postMessage(msg, e.origin);
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
<\/script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

function oauthErrorPage(description) {
  const payload = JSON.stringify({ message: description });
  const message = 'authorization:github:error:' + payload;
  return new Response(
    `<!DOCTYPE html><html><body><script>
(function () {
  var msg = ${JSON.stringify(message)};
  window.opener && window.opener.postMessage(msg, '*');
  document.write('<p>Authorization failed: ' + ${JSON.stringify(description)} + '</p>');
})();
<\/script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
