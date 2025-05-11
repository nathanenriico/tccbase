document.addEventListener("DOMContentLoaded", function () {
    console.log("Query string recebida:", window.location.search);

    // Recupera os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    let preco = params.get("preco");
    let imagemCarro = params.get("imagem");

    // Se o preço não estiver na URL, tenta recuperar do localStorage
    if (!preco || isNaN(parseFloat(preco))) {
        const carrosSalvos = JSON.parse(localStorage.getItem("carrosDisponiveis")) || [];
        if (carrosSalvos.length > 0) {
            preco = carrosSalvos[carrosSalvos.length - 1].preco;
            imagemCarro = carrosSalvos[carrosSalvos.length - 1].imagens[0]; // Pega a primeira imagem salva
        } else {
            preco = "0"; 
            imagemCarro = "img/fallback.png"; // Imagem padrão caso não haja veículo salvo
        }
    }

    console.log("Preço recuperado:", preco);
    console.log("Imagem do carro recuperada:", imagemCarro);

    // Atualiza a exibição do preço na interface de financiamento
    const valorTotalInput = document.getElementById("valorTotal");
    if (valorTotalInput) {
        valorTotalInput.value = parseFloat(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    const entradaInput = document.getElementById("entrada");
    const valorFinanciadoInput = document.getElementById("valorFinanciado");

    // Define um valor inicial para a entrada (mínimo de 10% do preço)
    let entradaInicial = parseFloat(preco) * 0.1;
    entradaInput.value = entradaInicial.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // Atualiza dinamicamente o financiamento com base no valor inserido na entrada
    entradaInput.addEventListener("input", function () {
        // Remove os símbolos de moeda e caracteres de formatação para obter um número
        let entradaStr = entradaInput.value.replace(/[R$\s.]/g, "").replace(",", ".");
        let entradaValor = parseFloat(entradaStr);
        let precoCarro = parseFloat(preco);

        if (!isNaN(entradaValor) && entradaValor >= 0 && entradaValor <= precoCarro) {
            let novoFinanciado = precoCarro - entradaValor;
            valorFinanciadoInput.value = novoFinanciado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        } else {
            valorFinanciadoInput.value = precoCarro.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); 
        }
    });

    // Atualiza a imagem do carro na interface
    const carImageEl = document.getElementById("carImage");
    if (carImageEl) {
        carImageEl.src = imagemCarro;
    }
});