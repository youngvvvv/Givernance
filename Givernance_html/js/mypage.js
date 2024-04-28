
document.addEventListener('DOMContentLoaded', function () {
    const connectButton = document.getElementById('connectButton');
    const confirmButton = document.getElementById('confirmButton');
    const accountSelector = document.getElementById('accountSelector');
    const accountsDropdown = document.getElementById('accounts');
    const walletAddressSpan = document.getElementById('walletAddress');
    const walletBalanceSpan = document.getElementById('walletBalance');
    const copyButton = document.getElementById('copyButton');

    if (localStorage.getItem('connectedAddress')) {
        walletAddressSpan.innerText = localStorage.getItem('connectedAddress');
        walletBalanceSpan.innerText = localStorage.getItem('connectedBalance');
        copyButton.style.display = 'inline';
    }

    connectButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
                const accounts = await ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    accountsDropdown.innerHTML = accounts.map(account => `<option value="${account}">${account}</option>`).join('');
                    accountSelector.style.display = 'block';
                }
                
            } catch (err) {
                console.error(err);
                alert('Failed to connect MetaMask, make sure it is installed and try again.');
            }
            
        } else {
            accountSelector.style.display = 'none';
            alert('MetaMask is not installed!');
        }
    });
/*
    confirmButton.addEventListener('click', async () => {
        const selectedAccount = accountsDropdown.value;
        walletAddressSpan.innerText = selectedAccount; // 선택된 주소 표시
        localStorage.setItem('connectedAddress', selectedAccount); // 로컬 스토리지에 저장
        copyButton.style.display = 'inline'; // 복사 버튼 표시

        // 연결된 지갑의 잔액을 조회
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(selectedAccount);
        const balanceInEth = ethers.utils.formatEther(balance); // wei에서 Ether로 변환
        walletBalanceSpan.innerText = parseFloat(balanceInEth).toFixed(4) + ' ETH'; // 소수점 네 자리까지 표시
    });
*/
    confirmButton.addEventListener('click', async () => {
         const selectedAccount = accountsDropdown.value;
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const balance = await provider.getBalance(selectedAccount);
         const balanceInEth = ethers.utils.formatEther(balance);

    // 주소와 잔액 정보를 로컬 스토리지에 저장
        localStorage.setItem('connectedAddress', selectedAccount);
        localStorage.setItem('connectedBalance', `${parseFloat(balanceInEth).toFixed(4)} ETH`);

    // 화면에 정보 표시
        walletAddressSpan.innerText = selectedAccount;
        walletBalanceSpan.innerText = `${parseFloat(balanceInEth).toFixed(4)} ETH`;
        copyButton.style.display = 'inline';
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(walletAddressSpan.innerText).then(() => {
            alert('Address copied to clipboard!');
        }, err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy address.');
        });
    });
});
