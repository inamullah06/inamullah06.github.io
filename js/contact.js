window.Portfolio = window.Portfolio || {};

window.Portfolio.initContact = function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const endpoint = window.Portfolio.config.formEndpoint.trim();
  const status = document.getElementById("form-status");
  const submit = form.querySelector("[type=submit]");
  const submitLabel = form.querySelector(".submit-label");
  const mode = document.getElementById("form-mode");
  const note = document.getElementById("form-note");
  const fields = ["name", "email", "subject", "message"];

  if (endpoint) {
    mode.textContent = "Configured form service";
    note.textContent = "This form uses the configured external form service. Success is shown only after the service confirms a successful response.";
    submitLabel.textContent = "Send message";
  }

  const errorFor = (id, message) => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    error.textContent = message;
  };

  const validate = () => {
    const values = Object.fromEntries(fields.map((id) => [id, document.getElementById(id).value.trim()]));
    const errors = {
      name: values.name.length >= 2 ? "" : "Please enter at least 2 characters for your name.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) ? "" : "Please enter a valid email address.",
      subject: values.subject.length >= 3 ? "" : "Please enter a subject of at least 3 characters.",
      message: values.message.length >= 10 ? "" : "Please write a message of at least 10 characters."
    };
    fields.forEach((id) => errorFor(id, errors[id]));
    const firstInvalid = fields.find((id) => errors[id]);
    if (firstInvalid) document.getElementById(firstInvalid).focus();
    return { valid: !firstInvalid, values };
  };

  fields.forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      errorFor(id, "");
      status.textContent = "";
      status.className = "form-status";
    });
  });

  const setSubmitting = (active, label) => {
    form.classList.toggle("is-submitting", active);
    submit.disabled = active;
    submit.setAttribute("aria-busy", String(active));
    submitLabel.textContent = label;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";
    if (document.getElementById("website").value) {
      status.textContent = "This submission could not be processed.";
      status.classList.add("error");
      return;
    }
    const { valid, values } = validate();
    if (!valid) {
      status.textContent = "Please correct the highlighted fields.";
      status.classList.add("error");
      return;
    }

    if (!endpoint) {
      setSubmitting(true, "Opening email…");
      const body = `Hello Inam,\n\n${values.message}\n\nFrom: ${values.name}\nEmail: ${values.email}`;
      const mailto = `mailto:${window.Portfolio.config.profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app. Your message has not been sent yet—send it there to complete.";
      status.classList.add("success");
      window.location.href = mailto;
      window.setTimeout(() => setSubmitting(false, "Compose message"), 800);
      return;
    }

    setSubmitting(true, "Sending…");
    const formData = new FormData();
    fields.forEach((id) => formData.append(id, values[id]));
    formData.append("_subject", values.subject);
    formData.append("_honey", document.getElementById("website").value);

    fetch(endpoint, { method: "POST", body: formData, headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error("The form service did not confirm submission.");
        form.reset();
        fields.forEach((id) => errorFor(id, ""));
        status.textContent = "Your message was sent successfully.";
        status.classList.add("success");
      })
      .catch(() => {
        status.textContent = "The form service could not confirm delivery. Please try again or email Inam directly.";
        status.classList.add("error");
      })
      .finally(() => setSubmitting(false, "Send message"));
  });
};
