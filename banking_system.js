const readline = require('readline');
const BankAccount = require('./bank_account');

const myAccount = new BankAccount('User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('\n=== Menu Sistem Perbankan ===');
    console.log('1. Tambah Saldo');
    console.log('2. Kurangi Saldo');
    console.log('3. Cek Saldo');
    console.log('4. Keluar');
}

function getUserChoice() {
    rl.question('Pilih opsi (1-4): ', async (choice) => {
        switch (choice) {
            case '1':
                const amountToAdd = parseInt(await askQuestion('Masukkan jumlah saldo yang ingin ditambahkan: '), 10);
                try {
                    const message = await myAccount.tambahSaldo(amountToAdd);
                    console.log(message);
                } catch (error) {
                    console.error(error);
                }
                getUserChoice();
                break;
            case '2':
                const amountToWithdraw = parseInt(await askQuestion('Masukkan jumlah saldo yang ingin dikurangi: '), 10);
                try {
                    const message = await myAccount.kurangiSaldo(amountToWithdraw);
                    console.log(message);
                } catch (error) {
                    console.error(error);
                }
                getUserChoice();
                break;
            case '3':
                console.log(`Saldo Anda saat ini: ${myAccount.formatRupiah(myAccount.saldo)}`);
                getUserChoice();
                break;
            case '4':
                console.log('Terima kasih telah menggunakan sistem perbankan. Sampai jumpa!');
                rl.close();
                break;
            default:
                console.log('Pilihan tidak valid. Silakan pilih 1-4.');
                getUserChoice();
        }
    });
}

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

showMenu();
getUserChoice();
