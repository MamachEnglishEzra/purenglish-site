(function () {
  function injectPartial(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) { el.outerHTML = html; })
      .catch(function () { /* silently fail — keeps hardcoded fallback if any */ });
  }

  injectPartial('site-header', '/partials/header.html');
  injectPartial('site-footer', '/partials/footer.html');
})();
