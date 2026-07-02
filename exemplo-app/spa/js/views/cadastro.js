function setFeedback(feedback, message, type) {
  const className = type === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-red-200 bg-red-50 text-red-800";

  feedback.className = `rounded border p-4 text-sm font-semibold ${className}`;
  feedback.textContent = message;
  feedback.classList.remove("hidden");
}

function validateForm(form) {
  const name = form.elements.namedItem("nome").value.trim();
  const email = form.elements.namedItem("email").value.trim();
  const password = form.elements.namedItem("senha").value;
  const address = form.elements.namedItem("endereco").value.trim();

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

export function renderCadastro(app) {
  app.innerHTML = `
    <main class="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
      <section>
        <p class="text-sm font-bold uppercase tracking-wide text-amber-700">Cliente</p>
        <h1 class="mt-2 text-4xl font-black text-stone-950">Cadastro simulado</h1>
        <p class="mt-4 text-base leading-7 text-stone-600">Os dados ficam apenas no localStorage para demonstrar fluxo de formulario sem backend real.</p>
      </section>

      <form data-signup-form class="rounded border border-stone-200 bg-white p-5 shadow-sm">
        <div data-feedback class="mb-5 hidden"></div>

        <div class="grid gap-5">
          <label class="grid gap-2">
            <span class="text-sm font-bold text-stone-700">Nome</span>
            <input name="nome" type="text" autocomplete="name" class="h-11 rounded border border-stone-300 px-3 text-sm text-stone-950 outline-none transition focus:border-amber-500" required>
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-bold text-stone-700">E-mail</span>
            <input name="email" type="email" autocomplete="email" class="h-11 rounded border border-stone-300 px-3 text-sm text-stone-950 outline-none transition focus:border-amber-500" required>
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-bold text-stone-700">Senha</span>
            <input name="senha" type="password" autocomplete="new-password" class="h-11 rounded border border-stone-300 px-3 text-sm text-stone-950 outline-none transition focus:border-amber-500" required>
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-bold text-stone-700">Endereco</span>
            <textarea name="endereco" rows="4" class="rounded border border-stone-300 px-3 py-3 text-sm text-stone-950 outline-none transition focus:border-amber-500" required></textarea>
          </label>
        </div>

        <button type="submit" class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-stone-950 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-500 hover:text-stone-950">
          <i data-lucide="save" class="h-5 w-5"></i>
          Salvar cadastro
        </button>
      </form>
    </main>
  `;

  const form = app.querySelector("[data-signup-form]");
  const feedback = app.querySelector("[data-feedback]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errorMessage = validateForm(form);

    if (errorMessage) {
      setFeedback(feedback, errorMessage, "error");
      return;
    }

    const customer = {
      nome: form.elements.namedItem("nome").value.trim(),
      email: form.elements.namedItem("email").value.trim(),
      endereco: form.elements.namedItem("endereco").value.trim(),
      criadoEm: new Date().toISOString()
    };

    localStorage.setItem("guitarras-app-customer", JSON.stringify(customer));
    form.reset();
    setFeedback(feedback, "Cadastro simulado salvo no localStorage.", "success");
  });
}
