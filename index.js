const input = document.querySelector('.search');
const searchBlock = document.querySelector('.search-block');
const resultBlock = document.querySelector('.result-list');
const searchList = document.querySelector('.list');

let repositaries = [];

async function searchRep() {
    if (input.value) {
        return await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=${5}`)
            .then(response => {
                response.json().then(listResult)
            })
    } else {
        clearSearchList(); // if input.value empty
    }
}

function deBounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

function createElem(tag, classTag, text) {
    const el = document.createElement(tag);
    if (classTag) el.classList.add(classTag);
    if (text) el.textContent = text;
    return el;
}

function listResult(response) {
    if (input.value) {
        clearSearchList();
        response.items.forEach((e) => {
            let elem = createElem('li', 'list__item', e['name']);
            searchList.append(elem);
            repositaries.push(e);
        });
        console.log(repositaries);
    }
}

function clearSearchList() {
    searchList.innerHTML = '';
    repositaries = [];
}

function selectRep(repos) {
    let liResItem = createElem('li', 'result-list__item');
    let infoList = createElem('ul', 'info-list');
    let elemName = createElem('li', 'items', `Name: ${repos['name']}`);
    infoList.append(elemName);
    let elemOwner = createElem('li', 'items', `Owner: ${repos['owner']["login"]}`);
    infoList.append(elemOwner);
    let elemStars = createElem('li', 'items', `Stars: ${repos["stargazers_count"]}`);
    infoList.append(elemStars);
    let closeButton = createElem('button', 'close-button');
    liResItem.append(infoList);
    liResItem.append(closeButton);
    resultBlock.append(liResItem);
}

input.addEventListener('keyup', deBounce(searchRep, 600));

searchBlock.addEventListener('click', (event) => {
    repositaries.forEach((e) => {
        if (event.target.textContent === e['name']) {
            selectRep(e); // add card result
            input.value = '';
            clearSearchList(); // clear search list
        }
    })
})

resultBlock.addEventListener('click', function (event) { // close result card
    if (event.target.classList[0] === 'close-button') {
        event.target.parentElement.remove();
    }
})
