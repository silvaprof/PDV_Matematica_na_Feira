// nota.js 

class NotaView {
  constructor() {
    this.tbody = document.querySelector('#tabelaProdutos tbody');
    this.totalEl = document.getElementById('total');
    this.valorPagoEl = document.getElementById('valorPago');
    this.trocoEl = document.getElementById('troco');
    this.voltarBtn = document.querySelector('button');
  }
  renderNota(dados) {
    this.tbody.innerHTML = '';
    dados.pedido.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.produto}</td>
        <td>${item.peso.toFixed(2)}</td>
        <td>${this.formatarReal(item.preco)}</td>
        <td>${this.formatarReal(item.preco * item.peso)}</td>
      `;
      this.tbody.appendChild(tr);
    });
    this.totalEl.textContent = 'Total: ' + this.formatarReal(dados.total);
    this.valorPagoEl.textContent = 'Valor pago: ' + this.formatarReal(dados.valorPago);
    this.trocoEl.textContent = 'Troco: ' + this.formatarReal(dados.troco);
  }
  showError(msg) {
    document.body.innerHTML = `<p>${msg}</p>`;
  }
  setVoltarHandler(handler) {
    this.voltarBtn.onclick = handler;
  }
  formatarReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}

class NotaController {
  constructor(view) {
    this.view = view;
    this.init();
  }
  init() {
    const params = new URLSearchParams(window.location.search);
    const dadosStr = params.get('dados');
    if (!dadosStr) {
      this.view.showError('Erro: dados do pedido não encontrados.');
      return;
    }
    const dados = JSON.parse(decodeURIComponent(dadosStr));
    this.view.renderNota(dados);
    this.view.setVoltarHandler(() => {
      localStorage.removeItem('pedido');
      window.location.href = '/pdv/';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const view = new NotaView();
  new NotaController(view);
});
