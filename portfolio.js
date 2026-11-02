(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const items = document.querySelectorAll(".section-head,.timeline-item,.variation-card,.project-row,.photo-score figure,.essay-piece");
    items.forEach(el => el.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {rootMargin: "0px 0px -8% 0px", threshold: .08});
    items.forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(el);
    });
  }

  const openDialogAtCurrentScroll = dialog => {
    const x = window.scrollX;
    const y = window.scrollY;
    if (!dialog || typeof dialog.showModal !== "function") return;
    dialog.showModal();
    const restoreScroll = () => window.scrollTo({left: x, top: y, behavior: "instant"});
    restoreScroll();
    requestAnimationFrame(restoreScroll);
  };

  document.querySelectorAll("[data-dialog-open]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      openDialogAtCurrentScroll(document.getElementById(trigger.dataset.dialogOpen));
    });
  });

  document.querySelectorAll("[data-card-open]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      openDialogAtCurrentScroll(document.getElementById(trigger.dataset.cardOpen));
    });
  });


  document.querySelectorAll(".writing-dialog").forEach(dialog => {
    const items = [...document.querySelectorAll(`[data-card-group="${dialog.dataset.cardGroup}"]`)];
    const index = items.indexOf(dialog);
    const go = (direction) => {
      const next = items[index + direction];
      if (!next) return;
      dialog.close();
      openDialogAtCurrentScroll(next);
    };
    dialog.querySelector("[data-card-prev]")?.addEventListener("click", () => go(-1));
    dialog.querySelector("[data-card-next]")?.addEventListener("click", () => go(1));
    const prev = dialog.querySelector("[data-card-prev]");
    const next = dialog.querySelector("[data-card-next]");
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === items.length - 1;
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    });
  });

  document.querySelectorAll(".info-dialog").forEach(dialog => {
    dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  });
})();
