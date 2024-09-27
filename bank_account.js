class BankAccount {
    constructor(accountName) {
        this.accountName = accountName;
        this._balance = 0;
    }

    get balance() {
        return this._balance;
    }

    async deposit(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount > 0) {
                    this._balance += amount;
                    resolve(`Deposit berhasil sebesar Rp${amount}. Saldo saat ini: Rp${this._balance}`);
                } else {
                    reject('Jumlah deposit harus lebih besar dari 0.');
                }
            }, 2000);
        });
    }

    async withdraw(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount > 0 && amount <= this._balance) {
                    this._balance -= amount;
                    resolve(`Penarikan berhasil sebesar Rp${amount}. Saldo saat ini: Rp${this._balance}`);
                } else if (amount > this._balance) {
                    reject('Saldo tidak mencukupi untuk penarikan.');
                } else {
                    reject('Jumlah penarikan harus lebih besar dari 0.');
                }
            }, 2000);
        });
    }
}

module.exports = BankAccount;
