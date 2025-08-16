// pdv.js 

class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }
}

class ItemPedido {
  constructor(produto, peso) {
    this.produto = produto;
    this.peso = peso;
  }
  getSubtotal() {
    return this.produto.preco * this.peso;
  }
}

class Pedido {
  constructor() {
    this.itens = [];
  }
  adicionarItem(item) {
    this.itens.push(item);
  }
  removerItem(index) {
    this.itens.splice(index, 1);
  }
  getTotal() {
    return this.itens.reduce((acc, item) => acc + item.getSubtotal(), 0);
  }
}

class PDVController {
  constructor(view) {
    this.pedido = new Pedido();
    this.view = view;
    this.produtoSelecionado = null;
    this.init();
  }
  init() {
    this.view.setProdutoClickHandler(produto => {
      this.produtoSelecionado = produto;
    });
    this.view.setAdicionarHandler(peso => {
      if (!this.produtoSelecionado || isNaN(peso) || peso <= 0) {
        this.view.showAlert('Selecione um produto e informe o peso corretamente.');
        return;
      }
      const item = new ItemPedido(this.produtoSelecionado, peso);
      this.pedido.adicionarItem(item);
      this.produtoSelecionado = null;
      this.view.clearPeso();
      this.view.clearProdutoSelecao();
      this.view.renderPedido(this.pedido.itens, this.pedido.getTotal());
    });
    this.view.setRemoverHandler(index => {
      this.pedido.removerItem(index);
      this.view.renderPedido(this.pedido.itens, this.pedido.getTotal());
    });
    this.view.setFinalizarHandler(valorPago => {
      const total = this.pedido.getTotal();
      if (this.pedido.itens.length === 0) {
        this.view.showAlert('Adicione ao menos um produto ao pedido.');
        return;
      }
      if (isNaN(valorPago) || valorPago < total) {
        this.view.showAlert('Valor pago insuficiente.');
        return;
      }
      const dados = encodeURIComponent(JSON.stringify({
        pedido: this.pedido.itens.map(item => ({
          produto: item.produto.nome,
          preco: item.produto.preco,
          peso: item.peso
        })),
        total,
        valorPago,
        troco: valorPago - total
      }));
      window.location.href = `nota.html?dados=${dados}`;
    });
  }
}

class PDVView {
  constructor() {
    this.botoes = document.querySelectorAll('.btn-produto');
    this.pesoInput = document.getElementById('peso');
    this.adicionarBtn = document.getElementById('adicionar');
    this.removerBtns = [];
    this.finalizarBtn = document.getElementById('finalizar');
    this.tabela = document.getElementById('tabelaPedido');
    this.corpoTabela = document.getElementById('corpoTabela');
    this.totalEl = document.getElementById('totalPedido');
    this.valorPagoInput = document.getElementById('valorPago');
  }
  setProdutoClickHandler(handler) {
    this.botoes.forEach(botao => {
      botao.addEventListener('click', () => {
        this.botoes.forEach(b => b.classList.remove('selecionado'));
        botao.classList.add('selecionado');
        handler(new Produto(botao.dataset.produto, parseFloat(botao.dataset.preco)));
      });
    });
  }
  setAdicionarHandler(handler) {
    this.adicionarBtn.addEventListener('click', () => {
      handler(parseFloat(this.pesoInput.value));
    });
  }
  setRemoverHandler(handler) {
    this.corpoTabela.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON' && e.target.dataset.index) {
        handler(parseInt(e.target.dataset.index));
      }
    });
  }
  setFinalizarHandler(handler) {
    this.finalizarBtn.addEventListener('click', () => {
      handler(parseFloat(this.valorPagoInput.value));
    });
  }
  renderPedido(itens, total) {
    this.corpoTabela.innerHTML = '';
    if (itens.length === 0) {
      this.tabela.style.display = 'none';
      this.totalEl.textContent = this.formatarReal(0);
      return;
    }
    this.tabela.style.display = 'table';
    itens.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.produto.nome}</td>
        <td>${this.formatarReal(item.produto.preco)}</td>
        <td>${item.peso.toFixed(2)}</td>
        <td>${this.formatarReal(item.getSubtotal())}</td>
        <td><button data-index="${i}">Remover</button></td>
      `;
      this.corpoTabela.appendChild(tr);
    });
    this.totalEl.textContent = this.formatarReal(total);
  }
  showAlert(msg) {
    alert(msg);
  }
  clearPeso() {
    this.pesoInput.value = '';
  }
  clearProdutoSelecao() {
    this.botoes.forEach(b => b.classList.remove('selecionado'));
  }
  formatarReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const view = new PDVView();
  new PDVController(view);
});
