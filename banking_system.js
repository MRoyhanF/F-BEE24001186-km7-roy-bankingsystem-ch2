const readline = require('readline');
const BankAccount = require('./bank_account');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const myAccount = new BankAccount('Muhamad Royhan Fadhli');

function showMenu() {
    console.log(`
    === Basic Banking System ===
    1. Cek Saldo
    2. Deposit
    3. Tarik Tunai
    4. Keluar
    `);

    rl.question('Pilih opsi (1-4): ', (answer) => {
        if (answer === '1') {
            checkBalance();
        } else if (answer === '2') {
            promptDeposit();
        } else if (answer === '3') {
            promptWithdraw();
        } else if (answer === '4') {
            exitBankingSystem();
        } else {
            console.log('Pilihan tidak valid.');
            showMenu();
        }
    });
}

async function checkBalance() {
    try {
        console.log(`Saldo Anda saat ini: Rp${myAccount.balance}`);
    } catch (error) {
        console.error('Error saat memeriksa saldo:', error);
    } finally {
        showMenu();
    }
}

function validateAmountInput(input) {
    const amount = parseInt(input, 10);
    if (isNaN(amount) || amount <= 0) {
        return null;
    }
    return amount;
}

async function promptDeposit() {
    rl.question('Masukkan jumlah yang akan dideposit: ', async (input) => {
        const amount = validateAmountInput(input);
        if (amount === null) {
            console.log('Masukkan jumlah yang valid (hanya angka positif).');
            promptDeposit();
        } else {
            try {
                const message = await myAccount.deposit(amount);
                console.log(message);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                showMenu();
            }
        }
    });
}

async function promptWithdraw() {
    rl.question('Masukkan jumlah yang akan ditarik: ', async (input) => {
        const amount = validateAmountInput(input);
        if (amount === null) {
            console.log('Masukkan jumlah yang valid (hanya angka positif).');
            promptWithdraw();
        } else {
            try {
                const message = await myAccount.withdraw(amount);
                console.log(message);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                showMenu();
            }
        }
    });
}

function exitBankingSystem() {
    console.log('Terima kasih telah menggunakan Basic Banking System.');
    rl.close();
}

showMenu();
