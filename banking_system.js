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
            checkSaldo();
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

function checkSaldo() {
    console.log(`Saldo Anda saat ini: Rp${myAccount.saldo}`);
    showMenu();
}

function promptDeposit() {
    rl.question('Masukkan jumlah yang akan dideposit: ', (amount) => {
        amount = parseInt(amount, 10);
        myAccount.deposit(amount)
            .then((message) => {
                console.log(message);
                showMenu();
            })
            .catch((error) => {
                console.error('Error:', error);
                showMenu();
            });
    });
}

function promptWithdraw() {
    rl.question('Masukkan jumlah yang akan ditarik: ', (amount) => {
        amount = parseInt(amount, 10);
        myAccount.withdraw(amount)
            .then((message) => {
                console.log(message);
                showMenu();
            })
            .catch((error) => {
                console.error('Error:', error);
                showMenu();
            });
    });
}

function exitBankingSystem() {
    console.log('Terima kasih telah menggunakan Basic Banking System.');
    rl.close();
}

showMenu();
