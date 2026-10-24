# Páginas e navegação

Cada item cria uma seção na página e, se `menu` estiver ativo, um link no menu. Mude `enabled` para `false` para ocultar temporariamente ou remova o item. Para páginas extras, use `"type": "custom"` e os campos `title`, `description`, `paragraphs`, `image`, `imageAlt`, `buttonLabel` e `whatsappMessage`.

```json
{
  "pages": [
    { "id": "inicio", "label": "Início", "type": "home", "enabled": true, "menu": true },
    { "id": "sobre-mim", "label": "Sobre mim", "type": "about", "enabled": true, "menu": true },
    { "id": "clinica", "label": "A clínica", "type": "clinic", "enabled": true, "menu": true },
    { "id": "procedimentos", "label": "Procedimentos", "type": "services", "enabled": true, "menu": true },
    { "id": "modelos", "label": "Modelo glútea", "type": "models", "enabled": true, "menu": true },
    { "id": "produtos", "label": "Produtos", "type": "products", "enabled": true, "menu": true },
    { "id": "contato", "label": "Contato", "type": "contact", "enabled": true, "menu": true }
  ]
}
```
