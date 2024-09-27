class BankAccount {
    constructor(accountName) {
        this.accountName = accountName;
        this.saldo = 0;
    }

    formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka).replace('IDR', 'Rp').replace(',00', '');
    }

    tambahSaldo(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount > 0) {
                    this.saldo += amount;
                    resolve(`Saldo berhasil ditambahkan: ${this.formatRupiah(amount)}. Saldo saat ini: ${this.formatRupiah(this.saldo)}`);
                } else {
                    reject("Jumlah tidak valid untuk menambah saldo.");
                }
            }, 2000);
        });
    }

    kurangiSaldo(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount > 0 && amount <= this.saldo) {
                    this.saldo -= amount;
                    resolve(`Saldo berhasil dikurangi: ${this.formatRupiah(amount)}. Saldo saat ini: ${this.formatRupiah(this.saldo)}`);
                } else {
                    reject("Jumlah tidak valid untuk mengurangi saldo atau saldo tidak cukup.");
                }
            }, 2000);
        });
    }
}

module.exports = BankAccount;
