"use strict";
// tsc for the js file 
// but you must be wondering that how come the compiles js file of the ts 
// get added to the html 
// go to the html and add 
// <script src="./dist/index.js" type="module"></script> - there 
// then go live use live server go to inspect 
// and 
// Live reload enabled. index.html:39:13
// aloek Pramanik 
//  means js is successful 
// so the bottom line is , i dont need to touch the js file , i will code in ts and js will be get added auto matically .
const getUsername = document.querySelector('#user');
// as HTML  -> this part is the type asserrtion this line is using a type assertion totell type 
// typescript that the result of socument.queryselector('#user') shoild be treated as an html  iputelement .
//  this is typically done when you know that the selected element  will have properties and methods of an html inputElement .
const formSubmit = document.querySelector('#form');
// it can also be writeen like 
// const formSubmit:HTMLFormElement|null = document.querySelector('.form') ;
// the only wxtra thing is |null type which means we have to specific about the option 
// that is the only  reason  we choose the above one 
const main_container = document.querySelector(".main-container");
// reusable function 
//<T>,Promise<T>- when i call then i will tellthe data type  - this whole thing is called generics 
async function myCustomFetcher(url, options) {
    // we need to specify what is this function is gonna return 
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status:${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
    // now after the data is fetched , we will take that data and run it in loop 
}
const showResultUI = (singleUser) => {
    // destructuring 
    const { avatar_url, login, url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class="card">
        <img src=${avatar_url} alt=${login}/>
        <hr/>
        <div class="card-footer">
            <img src="${avatar_url}" alt="${login}"/>
            <a href="${url}">Github</a>
        </div>
        </div>
        `);
};
function fetchUserData(url) {
    // here means inside this function we will call another function 
    // with the help of which is 
    // as we want to create it as reusable function 
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log('login  ' + singleUser.login);
        }
    });
    // UserData  is  an object and whith [] we are telling it that it is an array of an object 
}
// function call on page load 
// default function call 
fetchUserData("https://api.github.com/users"); // by default this is returning a string 
//  remember to check if all the data exists in the form of array of  an object 
// search funcyionality 
formSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        // and this is why we had created a reusable function 
        // passing an url and an object 
        const allUsersData = await myCustomFetcher(url, {});
        const matchingUsers = allUsersData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        // we need to clear the previous daata 
        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML("beforeend", // it means at the bottom of the element 
            `<p class="empty-msg">No matching users found. </p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
