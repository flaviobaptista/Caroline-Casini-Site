# Paletas de cores

As cores ficam separadas por função para facilitar mudanças sem mexer no layout: `background` controla fundos e divisórias, `text` controla letras principais e secundárias, `buttons` controla os botões, e `gold`/`rose` são os acentos da identidade visual. O dourado usa faixas de sombra e brilho no CSS para um acabamento metálico; o rosa principal parte de `#d81a99`. Ajuste `goldShineAngle` para mudar a inclinação; em cada tema, `gold.shine` muda a cor, `gold.shineThickness` controla a largura da faixa mais luminosa e `gold.shineSpread` controla a dispersão suave ao redor dela. Espessura e dispersão são números percentuais (sem o símbolo `%`). Em `familiasFonte`, `texto` controla os textos comuns e `titulos` define a fonte elegante dos títulos, valores e destaques. A seção `tamanhosFonte` reúne os tamanhos principais de fonte, incluindo variações responsivas. `menuRodape` altera somente os links do menu no rodapé.

```json
{
  "goldShineAngle": "50deg",
  "familiasFonte": {
    "texto": "\"DM Sans\", sans-serif",
    "titulos": "\"Cormorant Garamond\", Georgia, serif"
  },
  "tamanhosFonte": {
    "textoPrincipal": "16px",
    "textoPrincipalTelaGrande": "clamp(17px, .8vw, 21px)",
    "textoPrincipalTelaMuitoGrande": "22px",
    "textoPrincipalCelular": "15px",
    "tituloInicio": "clamp(44px, 6vw, 88px)",
    "tituloInicioTelaGrande": "clamp(78px, 5vw, 112px)",
    "tituloInicioTablet": "clamp(48px, 12vw, 76px)",
    "tituloInicioCelular": "clamp(43px, 13vw, 63px)",
    "tituloSecao": "clamp(34px, 4.3vw, 58px)",
    "tituloSecaoTelaGrande": "clamp(54px, 3.4vw, 76px)",
    "tituloCartao": "21px",
    "tituloCartaoTelaGrande": "25px",
    "tituloCartaoCelular": "18px",
    "tituloProduto": "23px",
    "textoIntroducao": "clamp(15px, 1.35vw, 18px)",
    "textoIntroducaoCelular": "15px",
    "menuSuperior": "12px",
    "menuSuperiorTelaGrande": "14px",
    "menuSuperiorTelaMuitoGrande": "16px",
    "menuSuperiorCelular": "12px",
    "botao": "14px",
    "rotuloPequeno": "13px",
    "textoPequeno": "15px",
    "textoMini": "13px",
    "textoAuxiliar": "13px",
    "textoComum": "14px",
    "endereco": "15px",
    "nomeMarca": "17px",
    "nomeMarcaCelular": "15px",
    "simboloMarca": "28px",
    "subtituloMarca": "13px",
    "subtituloMarcaCelular": "12px",
    "legendaDestaque": "19px",
    "legendaImagem": "16px",
    "numeroDestaque": "25px",
    "numeroDestaqueCelular": "21px",
    "tituloPromocao": "clamp(32px, 4vw, 48px)",
    "precoProcedimento": "23px",
    "precoProcedimentoCelular": "19px",
    "precoProduto": "21px",
    "tituloRodape": "17px",
    "menuRodape": "15px"
  },
  "light": {
    "background": {
      "page": "#f8f5f0",
      "surface": "#fffdf9",
      "section": "#f4edf1",
      "border": "#dddddd"
    },
    "text": {
      "primary": "#29231f",
      "secondary": "#766d72"
    },
    "gold": {
      "deep": "#765316",
      "base": "#bd8d22",
      "light": "#ffc481",
      "highlight": "#ffc481",
      "shine": "#ffdeb6",
      "shineThickness": 2,
      "shineSpread": 12
    },
    "rose": {
      "deep": "#a80d69",
      "base": "#d81a99",
      "light": "#eb65b9",
      "soft": "#f8e6f1"
    },
    "buttons": {
      "primary": "#c4859a",
      "hover": "#b83064",
      "text": "#ffffff",
      "border": "#9e2d53",
      "glow": "#ff026c",
      "quietBorder": "#e4d8df",
      "quietBackground": "#fffdf9",
      "quietText": "#29231f"
    }
  },
  "dark": {
    "background": {
      "page": "#191715",
      "surface": "#34323b",
      "section": "#241d22",
      "border": "#3c333a"
    },
    "text": {
      "primary": "#f2ece8",
      "secondary": "#b9abb4"
    },
    "gold": {
      "deep": "#9b6d1b",
      "base": "#d3a43c",
      "light": "#efd17b",
      "highlight": "#fff0b5",
      "shine": "#fff6d9",
      "shineThickness": 2,
      "shineSpread": 12
    },
    "rose": {
      "deep": "#a92070",
      "base": "#ed4cb4",
      "light": "#f477c8",
      "soft": "#3b1d31"
    },
    "buttons": {
      "primary": "#b43761",
      "hover": "#7c3b51",
      "text": "#fffdfa",
      "border": "#9e2d53",
      "glow": "#d81a99",
      "quietBorder": "#4b3b45",
      "quietBackground": "#24211e",
      "quietText": "#f2ece8"
    }
  }
}
```
