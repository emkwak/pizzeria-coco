// Booking Form
(function () {
  const form = document.getElementById("cateringForm");
  const submitBtn = document.getElementById("cf_submitBtn");
  const successBanner = document.getElementById("cf_success");
  const errorBanner = document.getElementById("cf_error");

  document.getElementById("cf_email").addEventListener("input", function () {
    document.getElementById("cf_replyto").value = this.value;
  });

  function validateField(wrapId, inputEl) {
    const wrap = document.getElementById(wrapId);
    if (!wrap || !inputEl) return true;
    const empty = !inputEl.value.trim();
    const badEmail =
      inputEl.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEl.value.trim());
    const invalid = empty || badEmail;
    wrap.classList.toggle("has-error", invalid);
    return !invalid;
  }

  const required = [
    ["cf_fullname", "cf-fullname"],
    ["cf_email", "cf-email"],
    ["cf_phone", "cf-phone"],
    ["cf_date", "cf-date"],
    ["cf_time", "cf-time"],
    ["cf_location", "cf-location"],
    ["cf_eventtype", "cf-eventtype"],
    ["cf_guests", "cf-guests"],
    ["cf_details", "cf-details"],
    ["cf_budget", "cf-budget"],
    ["cf_referral", "cf-referral"],
  ];

  required.forEach(([id, wrapId]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => validateField(wrapId, el));
    el.addEventListener("input", () => {
      if (document.getElementById(wrapId).classList.contains("has-error"))
        validateField(wrapId, el);
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let valid = true;
    required.forEach(([id, wrapId]) => {
      if (!validateField(wrapId, document.getElementById(id))) valid = false;
    });
    if (!valid) {
      const first = form.querySelector(".has-error");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    document.querySelector('input[name="subject"]').value =
      "Booking Inquiry - " + document.getElementById("cf_fullname").value;

    document.querySelector('input[name="from_name"]').value =
      document.getElementById("cf_fullname").value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
      });
      const data = await res.json();
      if (data.success) {
        form.style.display = "none";
        successBanner.style.display = "block";
      } else throw new Error();
    } catch {
      errorBanner.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Inquiry";
    }
  });
})();
