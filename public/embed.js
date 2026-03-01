(function () {
  "use strict";

  var ORIGIN = "https://www.geta2papproved.com";

  // Find the current script tag and read its data-token
  var scripts = document.getElementsByTagName("script");
  var currentScript = scripts[scripts.length - 1];
  var token = currentScript.getAttribute("data-token");

  if (!token) {
    console.error("[GetA2PApproved] Missing data-token attribute on embed script.");
    return;
  }

  // Find or create the target container
  var containerId = "a2p-doc-" + token;
  var container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    currentScript.parentNode.insertBefore(container, currentScript);
  }

  // Show loading state
  container.innerHTML = '<p style="color: #94a3b8; font-size: 0.875rem;">Loading document...</p>';

  // Fetch the document content
  var url = ORIGIN + "/api/embed/" + encodeURIComponent(token);

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data.html) throw new Error("No content");

      // Inject the document HTML (SEO footer is already included in the content)
      container.innerHTML = data.html;
    })
    .catch(function () {
      container.innerHTML =
        '<p style="color: #ef4444; font-size: 0.875rem;">Unable to load document. Please check that the embed code is correct.</p>';
    });
})();
