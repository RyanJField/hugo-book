// Image zoom: opens a Markdown image in a popup when its magnifying glass
// button, or the image itself, is clicked. One <dialog> is shared by every
// image on the page and is created the first time it is needed. The image
// first fits the popup; clicking it switches to full size, scrolled within the
// popup, and back. Escape, the close button or a click outside the image
// closes it.
(function () {
  if (window.bookImageZoom) return;
  window.bookImageZoom = true;

  var dialog, frame, image;

  function fit(full) {
    if (full) {
      // Full size: the image's own width, or twice the fitted width for an
      // image too small or with no size of its own (e.g. an SVG with only a viewBox)
      var fitted = frame.clientWidth;
      var width = Math.max(image.naturalWidth || 0, fitted * 2);
      image.style.width = width + "px";
      dialog.classList.add("book-zoom-full");
    } else {
      image.style.width = "";
      dialog.classList.remove("book-zoom-full");
    }
  }

  function create(closeLabel) {
    dialog = document.createElement("dialog");
    dialog.className = "book-zoom-dialog";

    var close = document.createElement("button");
    close.type = "button";
    close.className = "book-zoom-close";
    close.setAttribute("aria-label", closeLabel);
    close.setAttribute("title", closeLabel);
    close.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    close.addEventListener("click", function () {
      dialog.close();
    });

    frame = document.createElement("div");
    frame.className = "book-zoom-frame";
    image = document.createElement("img");
    image.addEventListener("click", function () {
      fit(!dialog.classList.contains("book-zoom-full"));
    });
    frame.appendChild(image);
    dialog.appendChild(close);
    dialog.appendChild(frame);

    // A click on the backdrop, outside the image, closes the popup
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target === frame) dialog.close();
    });
    dialog.addEventListener("close", function () {
      image.removeAttribute("src");
      fit(false);
    });

    document.body.appendChild(dialog);
  }

  function open(zoom) {
    var source = zoom.querySelector("img");
    var button = zoom.querySelector(".book-zoom-button");
    if (!source) return;
    if (!dialog) create(button ? button.getAttribute("data-close-label") : "Close");
    if (typeof dialog.showModal !== "function") {
      window.open(source.currentSrc || source.src, "_blank", "noopener");
      return;
    }
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    dialog.setAttribute("aria-label", source.alt || "");
    dialog.showModal();
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest) return;
    var zoom = event.target.closest(".book-zoom");
    if (!zoom || event.target.closest("a")) return;
    if (event.target.closest(".book-zoom-button") || event.target.tagName === "IMG") {
      event.preventDefault();
      open(zoom);
    }
  });
})();
