(function () {
  const form = document.querySelector("[data-signup-form]");
  const feedback = document.querySelector("[data-feedback]");

  function getField(name) {
    return form.elements.namedItem(name);
  }

  function setFeedback(message, type) {
    const className = type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

    feedback.className = `rounded border p-4 text-sm font-semibold ${className}`;
    feedback.textContent = message;
    feedback.classList.remove("hidden");
  }

  function validateForm() {
    const name = getField("nome").value.trim();
    const email = getField("email").value.trim();
    const password = getField("senha").value;
    const address = getField("endereco").value.trim();

    if (name.length < 3) {
      return "Informe um nome com pelo menos 3 caracteres.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Informe um e-mail valido.";
    }

    if (password.length < 6) {
      return "A senha precisa ter pelo menos 6 caracteres.";
    }

    if (address.length < 8) {
      return "Informe um endereco um pouco mais completo.";
    }

    return "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      setFeedback(errorMessage, "error");
      return;
    }

    const customer = {
      nome: getField("nome").value.trim(),
      email: getField("email").value.trim(),
      endereco: getField("endereco").value.trim(),
      criadoEm: new Date().toISOString()
    };

    localStorage.setItem("guitarras-app-customer", JSON.stringify(customer));
    form.reset();
    setFeedback("Cadastro simulado salvo no localStorage.", "success");
  });
})();
