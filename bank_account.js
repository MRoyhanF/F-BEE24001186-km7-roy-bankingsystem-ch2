class BankAccount {
    constructor(accountName) {
        this.accountName = accountName;
        this._saldo = 0;
    }

    get saldo() {
        return this._saldo;
    }

    deposit(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount > 0) {
                    this._saldo += amount;
                    resolve(`Deposit berhasil sebesar Rp${amount}. Saldo saat ini: Rp${this._saldo}`);
                } else {
                    reject('Jumlah deposit harus lebih besar dari 0.');
                }
            }, 2000);
        });
    }

    withdraw(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount > 0 && amount <= this._saldo) {
                    this._saldo -= amount;
                    resolve(`Penarikan berhasil sebesar Rp${amount}. Saldo saat ini: Rp${this._saldo}`);
                } else if (amount > this._saldo) {
                    reject('Saldo tidak mencukupi untuk penarikan.');
                } else {
                    reject('Jumlah penarikan harus lebih besar dari 0.');
                }
            }, 2000);
        });
    }
}

module.exports = BankAccount;
