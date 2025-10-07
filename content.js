(function () {
    'use strict';

    const collectedPairs = [];

    const buttonStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(40, 167, 69, 0.9)',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: '10000',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
    };

    const notificationStyle = {
        position: 'fixed',
        bottom: '70px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        zIndex: '10000',
        whiteSpace: 'pre-wrap',
        maxWidth: '300px',
        fontSize: '13px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
    };

    // const shortcutHintStyle = {
    //     position: 'fixed',
    //     bottom: '60px',
    //     right: '20px',
    //     background: 'rgba(100, 100, 100, 0.7)',
    //     color: '#fff',
    //     padding: '4px 10px',
    //     borderRadius: '4px',
    //     fontSize: '12px',
    //     zIndex: '10001',
    //     textAlign: 'center'
    // };

    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = '本の情報をコピー';
        Object.assign(button.style, buttonStyle);
        button.addEventListener('click', collectAndCopy);
        document.body.appendChild(button);
    }

    /*
    function createShortcutHint() {
        const hint = document.createElement('div');
        hint.textContent = 'Ctrl + Shift + Y';
        Object.assign(hint.style, shortcutHintStyle);
        document.body.appendChild(hint);
    } */

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        Object.assign(notification.style, notificationStyle);
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000); // 通知は2秒表示
    }

    async function collectAndCopy() {
        const bookTitleElm = document.querySelector('div > h3.opac_book_title');
        const bookAuthorElm = document.querySelector('div > div.opac_book_bibliograph');
        const url = window.location.href;

        if (bookTitleElm && bookAuthorElm && url) {
            const title = bookTitleElm.textContent.trim();
            const author = bookAuthorElm.textContent.trim();
            const pair = `${title} - ${author}\n${url}`;
            // const pair = `${answer}｜${word}`; // 「英単語日本語」 の形
            collectedPairs.push(pair);

            const textToCopy = collectedPairs.join('\n');

            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification(`コピー成功:\n${textToCopy}`);
            } catch (err) {
                console.error('Copy failed:', err);
                showNotification('コピーに失敗しました');
            }
        } else {
            showNotification('タイトルまたは著者が見つかりません');
        }
    }

    // 初期化処理
    createCopyButton();
    // createShortcutHint();

    // ショートカットキー対応：Ctrl + Shift + Y
    document.addEventListener('keydown', function (event) {
        console.log(event); // 追加
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyY') {
            event.preventDefault(); // 他の動作とバッティング防止
            collectAndCopy();
        }
    });
})();
