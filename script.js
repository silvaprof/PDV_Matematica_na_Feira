let pedido = [];

function adicionarPedido() {
    const produto = document.querySelector('input[name="produto"]:checked');
    const peso = parseFloat(document.getElementById('peso').value);
    if (!produto || isNaN(peso) || peso <= 0) {
        alert('Selecione um produto e informe o peso corretamente.');
        return;
    }
    const nome = produto.value;
    const preco = parseFloat(produto.getAttribute('data-preco'));
    pedido.push({ nome, peso, preco });
    atualizarPedido();
}

function atualizarPedido() {
    const lista = document.getElementById('pedido-lista');
    lista.innerHTML = '';
    let total = 0;
    pedido.forEach((item, idx) => {
        const valor = item.peso * item.preco;
        total += valor;
        const li = document.createElement('li');
        li.textContent = `${item.nome} - ${item.peso}kg x R$${item.preco.toFixed(2)} = R$${valor.toFixed(2)}`;
        lista.appendChild(li);
    });
    document.getElementById('total').textContent = `Total: R$${total.toFixed(2)}`;
}

function finalizarVenda() {
    let total = pedido.reduce((acc, item) => acc + item.peso * item.preco, 0);
    const valorPago = parseFloat(document.getElementById('valor-pago').value);
    if (isNaN(valorPago) || valorPago < total) {
        document.getElementById('resultado').textContent = 'Valor pago insuficiente.';
        return;
    }
    const troco = valorPago - total;
    document.getElementById('resultado').textContent = `Venda finalizada! Troco: R$${troco.toFixed(2)}`;
    pedido = [];
    atualizarPedido();
    document.getElementById('valor-pago').value = '';
}
