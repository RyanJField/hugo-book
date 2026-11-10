// Light / dark mode toggle.
//
// Runs in <head>, before the page is drawn, so a saved choice is applied
// without a flash of the other theme. The site's default is the BookTheme
// parameter: "light", "dark" or "auto" (follow the operating system). A
// visitor's choice is kept in localStorage under "book-theme".
(function () {
  var root = document.documentElement;
  var key = "book-theme";
  var fallback = {{ default "light" .Site.Params.BookTheme | jsonify }};
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function saved() {
    try {
      var value = localStorage.getItem(key);
      return value === "light" || value === "dark" ? value : null;
    } catch (e) {
      return null;
    }
  }

  function preferred() {
    if (fallback === "dark" || fallback === "light") return fallback;
    return media && media.matches ? "dark" : "light";
  }

  function label(button, theme) {
    var text = theme === "dark" ? button.getAttribute("data-label-light") : button.getAttribute("data-label-dark");
    button.setAttribute("aria-label", text);
    button.setAttribute("title", text);
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var buttons = document.querySelectorAll(".book-theme-toggle");
    for (var i = 0; i < buttons.length; i++) label(buttons[i], theme);
  }

  apply(saved() || preferred());

  // Follow the operating system while the visitor has not chosen a theme
  if (media) {
    var follow = function () {
      if (!saved()) apply(preferred());
    };
    if (media.addEventListener) media.addEventListener("change", follow);
    else if (media.addListener) media.addListener(follow);
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.getAttribute("data-theme"));
  });

  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest(".book-theme-toggle");
    if (!button) return;
    var theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(key, theme);
    } catch (e) {}
    apply(theme);
  });
})();
