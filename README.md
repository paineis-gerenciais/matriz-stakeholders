# Matriz de Stakeholders — Dashboard

Dashboard estático (HTML/CSS/JS) para gestão da Matriz de Poder x Interesse de stakeholders,
com persistência em nuvem via **Firebase Firestore** e publicação via **GitHub Pages**.

## Estrutura do projeto

```
stakeholders-dashboard/
├── index.html                # página principal
├── css/
│   └── style.css             # estilos
├── js/
│   ├── app.js                # lógica do dashboard (UI, estado, cálculos)
│   ├── firebase-config.js    # credenciais do seu projeto Firebase (edite aqui)
│   └── firestore-bridge.js   # camada de acesso ao Firestore (salvar/carregar/versões)
├── firestore.rules           # regras de segurança do banco
└── .github/workflows/deploy.yml  # publica automaticamente no GitHub Pages a cada push
```

O dashboard continua funcionando **offline**, salvando no `localStorage` do navegador
automaticamente. Os botões "Salvar" e "Carregar versões" passam a usar o Firestore
quando configurado (veja abaixo). Sem configuração, tudo continua local, como antes.

---

## PARTE 1 — Criar o banco de dados no Firestore

1. Acesse https://console.firebase.google.com e clique em **"Adicionar projeto"**.
2. Dê um nome (ex.: `matriz-stakeholders`) e finalize a criação (pode desativar o Google Analytics).
3. No menu lateral, vá em **Build > Firestore Database** → **Criar banco de dados**.
   - Escolha a localização (ex.: `southamerica-east1` para Brasil).
   - Comece em **modo de produção** (vamos configurar as regras manualmente).
4. Ainda no console, vá em **Configurações do projeto** (ícone de engrenagem) → aba **Geral**.
5. Em "Seus aplicativos", clique no ícone **`</>`** (Web) para registrar um app.
   - Dê um apelido (ex.: `dashboard-web`) e clique em **Registrar app**.
   - O Firebase vai mostrar um objeto `firebaseConfig` parecido com:
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
   - Copie esses valores.
6. Abra o arquivo `js/firebase-config.js` deste projeto e cole os valores no lugar de
   `COLE_AQUI_SUA_API_KEY` etc.
7. Publique as regras de segurança: no console, vá em **Firestore Database > Regras**,
   apague o conteúdo e cole o conteúdo do arquivo `firestore.rules` deste projeto.
   Clique em **Publicar**.

   > ⚠️ As regras padrão deste projeto liberam leitura/escrita pública (sem login),
   > o que é aceitável apenas para uso interno com link não divulgado. Veja no próprio
   > arquivo `firestore.rules` como restringir com autenticação.

Pronto — seu banco de dados na nuvem está criado. Os dados ficam salvos em duas coleções:
- `dashboards/{dashboardKey}` → versão atual do dashboard;
- `dashboards/{dashboardKey}/versions/{versionId}` → histórico de versões salvas.

---

## PARTE 2 — Publicar no GitHub (GitHub Pages)

### 2.1 Criar o repositório

1. Acesse https://github.com/new
2. Nome do repositório: por exemplo `matriz-stakeholders`.
3. Deixe **público** (necessário para o GitHub Pages gratuito) e não marque nenhuma opção
   de inicialização (sem README/gitignore, pois já temos os nossos).
4. Clique em **Create repository**.

### 2.2 Subir os arquivos

No seu computador, dentro da pasta `stakeholders-dashboard` (a que você baixou deste chat):

```bash
git init
git add .
git commit -m "Dashboard inicial com Firestore"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/matriz-stakeholders.git
git push -u origin main
```

> Troque `SEU_USUARIO` pelo seu usuário do GitHub.

### 2.3 Ativar o GitHub Pages

1. No repositório, vá em **Settings > Pages**.
2. Em "Build and deployment" → **Source**, selecione **GitHub Actions**
   (o workflow `.github/workflows/deploy.yml` já está pronto para isso).
3. Aguarde alguns segundos: vá em **Actions**, veja o workflow "Deploy GitHub Pages" rodar.
4. Ao concluir, volte em **Settings > Pages** — o link do seu dashboard publicado
   aparecerá no topo, algo como:
   `https://SEU_USUARIO.github.io/matriz-stakeholders/`

Pronto! Toda vez que você der `git push` para a branch `main`, o site é atualizado
automaticamente.

---

## PARTE 3 — Autorizar o domínio do GitHub Pages no Firebase

Por padrão, o Firebase só aceita chamadas de domínios autorizados:

1. No console do Firebase, vá em **Authentication > Settings > Domínios autorizados**
   (ou **Build > Authentication**, se ainda não estiver ativado, apenas acesse a aba de configurações).
2. Clique em **Adicionar domínio** e informe:
   `SEU_USUARIO.github.io`
3. Salve.

---

## PARTE 4 — Testar

1. Abra o link do GitHub Pages.
2. Preencha alguns stakeholders.
3. Clique em **Salvar** (o botão que hoje salva/sincroniza) — ele vai gravar no Firestore.
4. No console do Firebase, vá em **Firestore Database > Dados** e confirme que a
   coleção `dashboards` foi criada com seu documento.
5. Para testar o histórico, salve novamente após uma alteração e abra o modal de
   "carregar versões" — as versões anteriores devem aparecer.

---

## Rodando localmente antes de publicar

Como o navegador bloqueia módulos ES (`type="module"`) quando o arquivo é aberto
diretamente com `file://`, sirva a pasta com um servidor local simples:

```bash
# Python 3
python3 -m http.server 8080

# ou Node
npx serve .
```

Depois acesse `http://localhost:8080`.

---

## Segurança e custos

- O plano gratuito (**Spark**) do Firebase cobre folgadamente o uso de um dashboard
  interno (50 mil leituras e 20 mil escritas por dia).
- Se o dashboard for de uso restrito, ative **Authentication** e troque as regras do
  Firestore para exigir login, conforme comentado em `firestore.rules`.
- Nunca coloque a `apiKey` do Firebase como "segredo" — ela é pública por design (o que
  protege os dados são as **regras do Firestore**, não a chave).
