# Caroline Casini — site institucional

Site de página única criado com HTML, CSS e JavaScript puro. Não precisa instalar pacotes nem usar um gerenciador de conteúdo: os arquivos em `content/` são o CMS leve do site.

## Como abrir

Como o JavaScript carrega os textos com `fetch`, abra o projeto por um servidor local (não diretamente com duplo clique no `index.html`). No terminal, dentro desta pasta, execute:

```sh
node preview-server.js
```

Depois acesse `http://localhost:8000`. O servidor pode ficar aberto enquanto você navega. Para publicar, envie todos os arquivos e pastas para uma hospedagem estática que sirva HTML, CSS, JavaScript e Markdown pelo mesmo domínio.

## Editar o conteúdo

Cada arquivo de `content/` é Markdown com um bloco cercado por ```` ```json ```` e ```` ``` ````. Edite os valores dentro do bloco e mantenha a estrutura JSON válida: use aspas duplas, vírgulas entre propriedades e não coloque vírgula depois do último item. O texto Markdown fora do bloco serve como orientação e não aparece no site.

| Arquivo | O que controla |
| --- | --- |
| `settings.md` | Nome, WhatsApp, telefone, e-mail, endereço, mapa e redes sociais |
| `navigation.md` | Ordem, nomes e ativação das seções |
| `home.md` | Página inicial, foto, chamadas, números e faixa de promoção |
| `about.md` | Biografia e formação da Caroline |
| `clinic.md` | Apresentação demonstrativa do espaço |
| `services.md` | Procedimentos, descrições e imagens |
| `models.md` | Chamada demonstrativa para paciente modelo e valores de exemplo |
| `products.md` | Vitrine, preços e produtos de exemplo |
| `contact.md` | Textos da página Contato, que inclui o mapa |
| `seo.md` | Título, descrição, domínio, imagem de compartilhamento e palavras-chave |
| `theme.md` | Cores, brilho dourado, famílias de fontes e tamanhos tipográficos responsivos |

### Ativar, ocultar e acrescentar itens

- Para ocultar uma página sem apagar seu conteúdo, mude `"enabled": true` para `false` na página correspondente de `navigation.md`. Para escondê-la só do menu, use `"menu": false`.
- Em `services.md`, `products.md` e `settings.md` (redes sociais), cada item também pode ser ocultado com `"enabled": false`. Exclua o objeto inteiro para removê-lo.
- Para adicionar um serviço ou produto, copie um objeto existente dentro do respectivo array `items`, altere seus campos e mantenha a vírgula entre os objetos.
- Para adicionar uma seção nova, acrescente em `navigation.md` um objeto com `id` único e sem espaços (por exemplo, `duvidas`), `label`, `type: "custom"`, `enabled: true` e `menu: true`. Acrescente `title`, `description`, `paragraphs` (lista de textos) e, se quiser, `image`, `imageAlt`, `buttonLabel` e `whatsappMessage` no mesmo objeto. `softBackground: true` dá fundo suave à seção.
- Para trocar fotos por arquivos próprios, coloque as imagens em `assets/` e informe um caminho relativo como `assets/caroline.jpg` no campo `image`. Também pode usar um endereço completo de imagem hospedado.

## Personalizar tema e contatos

`theme.md` separa as cores de fundo, texto principal/secundário e botões, além dos acentos dourado metálico e rosa. `goldShineAngle` controla o ângulo do brilho; em cada tema, `gold.shine` define a cor e `gold.shineThickness`/`gold.shineSpread` ajustam a largura e a dispersão (valores numéricos percentuais). `familiasFonte.texto` define a fonte dos textos e `familiasFonte.titulos` define a fonte elegante para títulos e destaques. A seção `tamanhosFonte` usa nomes em português para controlar a tipografia e suas variações para celular e telas amplas; `menuRodape` altera somente os links do rodapé. Os valores podem usar unidades como `px` e funções como `clamp()`. A troca pelo sol e pela lua fica no menu superior, e a preferência do visitante é lembrada no navegador. Uma paleta sazonal pode ser aplicada alterando os tokens do arquivo.

Os links de redes sociais estão como `#`; substitua-os pelas contas oficiais. Atualize telefone, WhatsApp, e-mail, domínio, endereço e mapa em `settings.md` e `seo.md` antes de publicar. O número preenchido é apenas demonstrativo.

## Imagens e conteúdo demonstrativo

As fotos usam URLs ilustrativas externas e precisam de conexão com a internet para aparecer. A modelo, os preços dos procedimentos de paciente modelo e os produtos são fictícios para demonstração. Substitua os exemplos por conteúdo autorizado e revise as informações de atendimento antes de publicar.

## SEO e compartilhamento

O arquivo `seo.md` alimenta título, descrição, palavras-chave, URL canônica, metadados Open Graph/Twitter e os dados estruturados de negócio local. Para sincronizar esses dados também no HTML estático que redes sociais e buscadores leem antes de executar JavaScript, execute `node build-seo.js` após editar os arquivos Markdown e antes de publicar. É um script JavaScript sem pacotes adicionais. O campo `image` aceita caminho relativo do site (por exemplo, `img/logo_link_redes_sociais.png`) ou uma URL absoluta. Atualize `url` com o domínio publicado para que o caminho relativo vire uma URL completa nos cartões de compartilhamento. O favicon e a logo principal ficam em `img/`.
