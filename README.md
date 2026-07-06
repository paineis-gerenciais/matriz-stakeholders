# Matriz de Stakeholders — Dashboard (arquivo único)

Dashboard em um **único arquivo HTML** (`index.html`), com HTML, CSS e JavaScript
tudo embutido. Os dados são salvos automaticamente no navegador e, quando configurado,
também no **Firebase Firestore** (para acessar de qualquer computador/celular).

## Arquivos

```
index.html            → todo o dashboard (abra direto no navegador ou publique no GitHub Pages)
firestore.rules        → regras de segurança do banco de dados
.github/workflows/deploy.yml  → publica automaticamente no GitHub Pages a cada push
```

---

## PASSO 1 — Criar o banco de dados (Firestore)

1. Acesse https://console.firebase.google.com → **Adicionar projeto** → dê um nome (ex.: `matriz-stakeholders`) → conclua a criação.
2. No menu lateral, **Build > Firestore Database** → **Criar banco de dados** → escolha uma localização (ex.: `southamerica-east1`) → comece em **modo de produção**.
3. Em **Configurações do projeto** (ícone de engrenagem) → aba **Geral** → em "Seus aplicativos", clique no ícone **`</>`** (Web) → dê um apelido → **Registrar app**.
4. Copie o objeto `firebaseConfig` que aparece, parecido com:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "matriz-stakeholders.firebaseapp.com",
     projectId: "matriz-stakeholders",
     storageBucket: "matriz-stakeholders.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
5. Abra o arquivo `index.html` neste projeto, procure por `COLE_AQUI_SUA_API_KEY` (bem no início dos scripts, fácil de achar com Ctrl+F) e substitua os 6 valores pelos que você copiou.
6. No console do Firebase, vá em **Firestore Database > Regras**, apague o conteúdo e cole o conteúdo do arquivo `firestore.rules` deste projeto. Clique em **Publicar**.

   > ⚠️ As regras deste projeto liberam leitura/escrita para qualquer pessoa (sem login) — use assim apenas para uso interno com link não divulgado. O arquivo `firestore.rules` explica como restringir com autenticação, se precisar.

---

## PASSO 2 — Publicar no GitHub (GitHub Pages)

1. Crie um repositório novo em https://github.com/new (deixe **público**, sem inicializar com README).
2. No seu computador, dentro da pasta deste projeto:
   ```bash
   git init
   git add .
   git commit -m "Dashboard inicial"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/matriz-stakeholders.git
   git push -u origin main
   ```
3. No repositório, vá em **Settings > Pages** → em "Source" escolha **GitHub Actions** (o workflow já incluído cuida do resto).
4. Aguarde o workflow rodar em **Actions** (~1 minuto). Depois, em **Settings > Pages**, o link do site aparece, algo como:
   `https://SEU_USUARIO.github.io/matriz-stakeholders/`

### Alternativa sem terminal (upload manual)
Se preferir não usar `git`: no repositório, **Add file > Upload files**, arraste o `index.html`, a pasta `.github` e o `firestore.rules`, e confirme o commit. O resultado é o mesmo.

---

## PASSO 3 — Autorizar o domínio no Firebase

1. No console do Firebase, vá em **Authentication > Settings > Domínios autorizados**.
2. Clique em **Adicionar domínio** e informe: `SEU_USUARIO.github.io`
3. Salve.

---

## PASSO 4 — Testar

1. Abra o link do GitHub Pages.
2. Preencha alguns stakeholders e o Nome do Órgão/Entidade.
3. Clique em **Salvar**. No console do Firebase, em **Firestore Database > Dados**, confira se a coleção `dashboards` foi criada.
4. Clique em **Carregar** para ver o histórico de versões salvas.

---

## Rodando localmente antes de publicar

Como é um único arquivo, basta abrir `index.html` direto no navegador — funciona até sem servidor,
**exceto** a parte de Firestore (o navegador bloqueia módulos `type="module"` em `file://`).
Para testar o Firestore localmente, sirva a pasta com:

```bash
python3 -m http.server 8080
```

e acesse `http://localhost:8080`.

---

## Como funciona o Salvar/Carregar

- **Salvar**: grava no navegador (local) e, se o Firestore estiver configurado, também na nuvem.
  Se já existir uma versão salva com o mesmo Nome do Órgão/Entidade, ela é **atualizada**;
  caso contrário, uma **nova versão** é criada no histórico.
- **Carregar**: abre a lista de versões salvas na nuvem (ou local, se o Firestore não estiver configurado) para escolher qual restaurar.

## Segurança e custos

- O plano gratuito do Firebase (Spark) cobre folgadamente o uso de um dashboard interno.
- A `apiKey` do Firebase é pública por design — quem protege os dados são as **regras do Firestore** (`firestore.rules`), não o segredo da chave.
