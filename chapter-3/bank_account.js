class BankAccount {
    #saldo;

    constructor(ownerName) {
        this.ownerName = ownerName;
        this.#saldo = 0; 
    }

    async deposit(amount) {
        try {
            if (typeof amount !== 'number' || amount <= 0) throw new Error('Jumlah deposit tidak valid');
            await this.simulateAsyncOperation();
            this.#saldo += amount;
            return `Deposit berhasil. Saldo baru: Rp${this.#saldo}`;
        } catch (error) {
            throw new Error(`Deposit gagal: ${error.message}`);
        }
    }

    async withdraw(amount) {
        try {
            if (this.#saldo === 0) {
                throw new Error('Saldo Anda kosong. Tidak dapat menarik uang.');
            }
            if (typeof amount !== 'number' || amount <= 0) throw new Error('Jumlah penarikan tidak valid');
            if (this.#saldo < amount) throw new Error('Saldo Anda tidak mencukupi.');
            await this.simulateAsyncOperation();
            this.#saldo -= amount;
            return `Penarikan berhasil. Saldo baru: Rp${this.#saldo}`;
        } catch (error) {
            throw error; 
        }
    }

    async checkSaldo() {
        return `Saldo saat ini: Rp${this.#saldo}`;
    }

    async simulateAsyncOperation() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
}

class SavingsAccount extends BankAccount {
    constructor(ownerName, interestRate) {
        super(ownerName);
        this.interestRate = interestRate;
    }

    async withdraw(amount) {
        try {
            if (typeof amount !== 'number' || amount <= 0) throw new Error('Jumlah penarikan tidak valid');
            if (this.interestRate < 0) throw new Error('Tingkat bunga tidak valid');
            await this.simulateAsyncOperation();
            const message = await super.withdraw(amount);
            console.log(`Penarikan dari Rekening Tabungan dengan bunga: ${amount} pada tingkat: ${this.interestRate}%`);
            return message;
        } catch (error) {
            throw error; 
        }
    }
}

module.exports = { BankAccount, SavingsAccount };
