(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Mobile nav */
  const toggle = $(".menu-toggle");
  const nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("is-open"))
    );
  }

  /* Slider */
  const slider = $(".slider");
  if (slider) {
    const slides = $$(".slide", slider);
    const dotsWrap = $(".slider-dots", slider);
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Слайд ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      dotsWrap?.appendChild(dot);
    });

    const dots = $$(".dot", slider);

    function go(i) {
      slides[index]?.classList.remove("is-active");
      dots[index]?.classList.remove("is-active");
      index = (i + slides.length) % slides.length;
      slides[index]?.classList.add("is-active");
      dots[index]?.classList.add("is-active");
      restart();
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 5500);
    }

    $(".slider-prev", slider)?.addEventListener("click", () => go(index - 1));
    $(".slider-next", slider)?.addEventListener("click", () => go(index + 1));
    restart();
  }

  /* Modals */
  const backdrop = $("#modal-backdrop");
  const modalTitle = $("#modal-title");
  const modalComment = $("#modal-comment-wrap");
  const modalForm = $("#modal-form");
  const modalSuccess = $("#modal-success");
  let mode = "call";

  function openModal(nextMode) {
    mode = nextMode;
    if (!backdrop) return;
    modalSuccess?.classList.remove("is-visible");
    modalForm?.reset();
    if (mode === "call") {
      modalTitle.textContent = "Заказать звонок";
      modalComment?.setAttribute("hidden", "");
    } else {
      modalTitle.textContent = "Заявка в 1 клик";
      modalComment?.removeAttribute("hidden");
    }
    backdrop.classList.add("is-open");
    backdrop.setAttribute("aria-hidden", "false");
    $("#modal-name")?.focus();
  }

  function closeModal() {
    backdrop?.classList.remove("is-open");
    backdrop?.setAttribute("aria-hidden", "true");
  }

  $$("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.openModal));
  });

  $("#modal-close")?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function fakeSubmit(form, successEl) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      successEl?.classList.add("is-visible");
      form.reset();
      if (form.id === "modal-form") {
        setTimeout(closeModal, 1600);
      }
    });
  }

  if (modalForm) fakeSubmit(modalForm, modalSuccess);
  const contactForm = $("#contact-form");
  if (contactForm) fakeSubmit(contactForm, $("#contact-success"));

  /* Year */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
