var test = false; //toggle testing features in code if true

var currentPageTitle; //current page label
var cart = new Array(); //cart for purchases
var user = new Array(); //currently logged in user
var prices = new Map(); //store item prices for calculation purposes
prices.set("Barista Express 870XL", 699.95);
prices.set("Ninja Coffee Bar", 99.99);
prices.set("Hario V60 Ceramic", 19.99);
prices.set("Bottomless Portafilter 54mm", 69.99);
prices.set("Water Tank Filters", 9.99);
prices.set("V60 Unbleached Filters", 9.99);
prices.set("Coffee Beans (1lb.)", 16.99);
prices.set("Coffee Beans (5lbs.)", 89.99);

window.addEventListener('load', (event) =>
{
    currentPageTitle = document.getElementById('tab_name').innerHTML.toString();
    console.log("Page Title: " + currentPageTitle);
    var redirect; //page to redirect to
    
    //LOAD LOGGED IN USER
    if(getCookieArray('loggedIn') != "null")
    {
        user = JSON.parse(getCookie('loggedIn'));
        console.log("Loaded User ('loggedIn cookie') " + user[1]);
        //LOAD USER COLOR SCHEME
        document.getElementsByClassName("contentBg")[0].style = "border-top-width: 6px;border-top-style: solid;border-left-width: 6px;border-left-style: solid;border-right-width: 6px;border-right-style: solid;border-color: " + user[5] + ";";
    }
    else
    {
        document.getElementsByClassName("contentBg")[0].style = "border-top-width: 6px;border-top-style: solid;border-left-width: 6px;border-left-style: solid;border-right-width: 6px;border-right-style: solid;border-color: burlywood;";
        console.log("Not logged in");
    }

    //LOAD CART/CREATE CART COOKIE
    if(getCookieArray('cart') != "null")
    {
        cart = JSON.parse(getCookie('cart'));
        console.log("Cart cookie loaded\nCart contents: " + cart);
    }
    else
    {
        setCookie("cart", JSON.stringify(cart));
        console.log("Cart cookie created");
    }

    //window.onload codes
    switch(currentPageTitle)
    {
        case "sections/register_login/register": //PROCESS USER REGISTRATION
            {
                //Parse URL into array
                var params = URLtoArray();

                //Lazy Password Validation
                if(params["password"] != params["password2"])
                {
                    console.log("Password = " + params['password']);
                    console.log("Password2 = " + params['password2']);
                    console.log("passwords didn't match");
                    document.getElementById("fail_reason1").style = "display: block";
                    document.getElementById("failure_label").style = "display: block";
                    redirect = "register_login";
                }
                else
                {
                    //create account and save to local HTML5 DB
                    //check if user already exists
                    var duplicateUsername = false;
                    if(localStorage.length > 0) //if storage contains profiles
                    {
                        console.log("Local Storage Length = " + localStorage.length);
                        for(var i = 0; i < localStorage.length; ++i)
                        {
                            if(localStorage.key(i) == params["username"])
                            {
                                duplicateUsername = true;
                                console.log("Duplicate username detected!");
                                break;
                            }
                        }
                    }

                    //username available
                    if(duplicateUsername == false)
                    {
                        //fill empty indices
                        for(var i = 0; i < params.length; ++i)
                        {
                            if(params[i] == "")
                            {
                                params[i] = "n/a";
                            }
                        }

                        //create user new
                        if(typeof (Storage) !== "undefined")
                        {
                            var profile = 
                            {
                                email:params[1],
                                username:params[3],
                                password:params[5],
                                fname:params[7],
                                lname:params[9],
                                dob:params[11],
                                address:params[13],
                                city:params[15],
                                state:params[17],
                                zip:params[19],
                                tel1:params[21],
                                tel2:params[23],
                                tel3:params[25],
                                color:params[27],
                                about:params[29]
                            }
                            var data = 
                            {
                                "profile":profile
                            }
                            localStorage.setItem(params[3], JSON.stringify(data));
                            setCookie(params["username"], params);
                            console.log("passwords matched");
                            document.getElementById("success_label").style = "display: block";
                            redirect = "home";
                        }
                        else
                        {
                            alert("Your browser is not supported");
                        }
                    }
                    //username taken
                    else
                    {
                        document.getElementById("fail_reason2").style = "display: block";
                        document.getElementById("failure_label").style = "display: block";
                        console.log("Username already taken");
                        redirect = "register_login";
                    }
                }
                if(test != true)
                {
                    var timer = setTimeout(function() 
                    {
                        goToPage(redirect);
                    }, 3500);
                }
                else
                {
                    console.log("Redirect timer disabled in test mode. Use navigation buttons to navigate pages.");
                    document.getElementById("failure_label").innerHTML = "Account creation not successful.";
                    document.getElementById("success_label").innerHTML = "Account creation successful.";
                }
                break;
            }
        
        case "sections/products": //PRODUCTS PAGE
        {
            if(cart.length > 0)
            {
                document.getElementById('cart').style.display = "block";
            }
            if(test == true)
            {
                //make checkout modal visible by default
                checkoutPopup();
            }
            break;
        }

        case "sections/register_login/process_info": //USER FORGOT INFO PROCESSED PAGE
        {
            if(test != true)
                {
                    var timer = setTimeout(function() 
                    {
                        goToPage('home');
                    }, 3000);
                }
                else
                {
                    console.log("Redirect timer disabled in test mode. Use navigation buttons to navigate pages.");
                    document.getElementById("msg").style = "display: none;";
                }
            break;
        }

        case "sections/register_login/login": //PROCESS USER LOGIN
            {
                //Parse URL into array
                var params = URLtoArray();

                //CHECK DB FOR USERNAME
                if(localStorage.getItem(params["username"]) != null)
                {
                    if(localStorage.getItem(params["username"]).includes("password," + params["password"]))
                    {
                        //LOAD USER COLOR
                        var dataArray = localStorage.getItem(params["username"]).split(",");
                        for(var i = 0; i < dataArray.length; i+=2)
                        {
                            if(dataArray[i] == "color")
                            {
                                params.push("color", decodeURIComponent(dataArray[i+1]));
                                break;
                            }
                        }

                        setCookie('loggedIn', JSON.stringify(params));
                        document.getElementById("login_success").style = "display: block";
                        redirect = "home";
                    }
                    else
                    {
                        document.getElementById("login_failure2").style = "display: block";
                        redirect = "register_login";
                    }
                }
                else
                {
                    document.getElementById("login_failure1").style = "display: block";
                    redirect = "register_login";
                }

                if(test != true)
                {
                    var timer = setTimeout(function() 
                    {
                        goToPage(redirect);
                    }, 3500);
                }
                else
                {
                    console.log("Redirect timer disabled in test mode. Use navigation buttons to navigate pages.");
                    document.getElementById("login_success").innerHTML = "You have been logged in successfully.";
                    document.getElementById("login_failure1").innerHTML = "Couldn't log in. No account found with that username.";
                    document.getElementById("login_failure2").innerHTML = "Couldn't log in. You have entered the wrong password for that account.";
                }
                break;
            }
        case "sections/secured": //SECURED PAGE LOGIN CHECK
            {
                if(getCookieArray('loggedIn') == "null")
                {
                    document.getElementById('error').style = "display: block";
                    redirect = "home";
                    if(test != true)
                    {
                        var timer = setTimeout(function() 
                        {
                            goToPage(redirect);
                        }, 3500);
                    }
                    else
                    {
                        console.log("Redirect timer disabled in test mode. Use navigation buttons to navigate pages.");
                    }
                }
                else
                {
                    var cvalues = JSON.parse(getCookie("loggedIn"));
                    var index;

                    //find username
                    for(var i = 0; i < cvalues.length; i += 2)
                    {
                        if(cvalues[i] == "username")
                        {
                            index = i + 1;
                            break;
                        }
                    }
                    console.log("Cookie array: " + cvalues);
                    console.log("Username = " + cvalues[index]);

                    //use username to get profile
                    if(typeof (Storage) !== "undefined")
                    {
                        var dataArray = localStorage.getItem(cvalues[index]).split(",");
                        console.log("dataArray.length = " + dataArray.length);
                        for(var i = 1; i < dataArray.length; i+=2)
                        {
                            if(dataArray[i-1] == "password2")
                            {
                                i+=2;
                            }
                            console.log("Element " + dataArray[i-1] + " = " + decodeURIComponent(dataArray[i]));
                            document.getElementById(i).innerHTML = decodeURIComponent(dataArray[i]);
                        }
                    }
                    document.getElementById("header").style = "display:block";
                    document.getElementById("info").style = "display:block";
                }

                break;
            }
        default:
            {
                console.log(currentPageTitle + " has no onload code associated with it.");
                break;
            }
    }
});

/**
 * Hides any element, specifically used for hiding the modals on this site.
 * @param {*} modal The element id of the element to hide
 */
function closePopup(modal)
{
    document.getElementById(modal).style.display = "none";
}

/**
 * Calculate info and display on checkout modal
 */
function checkoutPopup()
{
    var popup = document.getElementById('checkout'); //checkout modal
    var tbody = document.getElementById('tableBody'); //table node that gets the rows
    var tbody2 = document.getElementById('tableBody2'); //table node that gets the rows in the checked out modal (yeah it's hacky I know)
    var orderTotalLabel = document.getElementById('orderTotal'); //order total cost
    var orderTotalLabel2 = document.getElementById('orderTotal2'); //order total cost in the checked out modal (yeah it's hacky I know)
    var row;
    var items = new Map(); //store items with quantity values

    //remove old tble data (if any)
    tbody.innerHTML = "";

    //Show popup
    popup.style.display='block';

    //add cart contents to hash map with counts for values
    for(var i = 0; i < cart.length; i+=2)
    {
        if(items.has(cart[i]) == false) //item not already added to map
        {
            items.set(cart[i], 1);
        }
        else if(items.has(cart[i]) == true) //item already exists in map
        {
            items.set(cart[i], items.get(cart[i]) + 1); //add one more to count value
        }
        else
        {
            console.log("Problem occurred while adding cart contents to map!");
        }
    }
    //create table rows with Map
    var productTotal; //Item type combined cost
    var orderTotal = 0; //Total cost for all items
    items.forEach((key, index) => 
    {
        productTotal = (key*prices.get(index));
        console.log("productName = " + index + "\nproductQuantity = " + key + "\nproductTotal = " + productTotal.toFixed(2));
        row = document.createElement('tr');
        row.innerHTML = '<td>' + index + '</td><td>' + key + '</td><td>' + "$" + productTotal.toFixed(2) + '</td>';
        tbody.appendChild(row);
        orderTotal += productTotal;
    });
    orderTotalLabel.innerText = "$" + orderTotal.toFixed(2);

    //update checkedout modal
    tbody2.innerHTML = tbody.innerHTML;
    orderTotalLabel2.innerText = orderTotalLabel.innerText;
}

/**
 * place order from product page
 */
function placeOrder()
{
    if(cart.length > 0)
    {
        var thisPopup = document.getElementById('checkedout'); //checkout confirmation modal
        var priorPopup = document.getElementById('checkout'); //checkout confirmation modal

        //hide checkout modal
        priorPopup.style.display='none';

        //show this modal
        thisPopup.style.display = "block";

        //clear cart array and cart cookie
        cart = new Array();
        setCookie("cart", JSON.stringify(cart));
        console.log('cart cookie cleared!');
    }
    else
    {
        console.log('NICE TRY NAUGHTY MAN');
    }
}

/** 
 * Creates a cookie or profile. Only meant to handle 1 of 2 cookie names: 'loggedIn' and 'cart'. If you pass any other cname it's assumed to 
 * be the username for a profile
 * @param {*} cname Cookie name
 * @param {*} cvalue Cookie value
 */
function setCookie(cname, cvalue) 
{
    var d = new Date();
    var expires;

    switch(cname)
    {
        case 'loggedIn':
            d.setTime(d.getTime() + (3600000)); //should be 1 hour
            expires = "expires="+ d.toUTCString();
            break;
        case 'cart':
            d.setTime(d.getTime() + (24*60*60*1000)); // should be 1 day
            expires = "expires="+ d.toUTCString();
            break;
        default: //profile
            localStorage.setItem(cname, cvalue);
            console.log("Profile saved to localStorage with key(username) = " + cname + " and value = " + cvalue);
    }
    
    if(cname == "loggedIn" || cname == "cart")
    {
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

/**
 * Utility function for getCookieArray(); Use getCookieArray()
 * TO DO: Use JSON.parse() to get array from profile value
 * @param {*} cname 
 */
function getCookie(cname) 
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie); 
    var ca = decodedCookie.split(';');

    for(var i = 0; i < ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') 
        {
            c = c.substring(1); 
        }
        if (c.indexOf(name) == 0) 
        {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * Modifies a property or adds a property to a cookie
 * @param {*} cname Name of cookie to modify
 * @param {*} property Name of property to add or modify
 * @param {*} newValue Value to be assigned in association with property
 */
function updateCookie(cname, property, newValue)
{
    var array = getCookieArray(cname);
    for(var i = 0; i < array.length; i += 2)
    {
        //property exists in cookie
        if(array[i] == property)
        {
            var oldValue = array[i + 1];
            array[i + 1] = newValue;
            console.log("Cookie updated; Existing property" + property + " modified. Old value: " + oldValue + "; new value: " + newValue);
            break;
        }
        //property didn't exist in cookie
        else if(i + 2 == array.length) //last iteration
        {
            array.push(cname, newValue);
            setCookie(cname, array);
            console.log("Cookie updated; Property " + property + " added to cookie with value: " + newValue)
        }
    }
}

/**
 * Returns array representation of a stored cookie
 * @param {*} cname Name of Cookie
 */
function getCookieArray(cname)
{
    var array = new Array();
    array = JSON.stringify(getCookie(cname));
    if(array.length > 0)
    {
        return array;
    }
    else
    {
        return null;
    }
}

/**
 * Turns information passed from form into an array and returns the array
 */
function URLtoArray()
{
    var params = new Array(); //array of user info
    var queryString = window.location.search.replaceAll("?", "").replace(/\+/g, " ");
    var varArray = queryString.split("&"); 
    for (var i = 0; i < varArray.length; i++) 
    {
        var param = varArray[i].split("="); 
        params[param[0]] = param[1]; //store properties
        params.push(param[0], param[1]); //store array elements
    }
    return params;
}

/**
 * Pulls info from localStorage and returns an array representation (not an elegant solution)
 * @param {*} username Username for profile
 */
function profileToArray(username)
{
    console.log("function call = profileToArray(" + username + ");");
    var profileArray = new Array();
    if(localStorage.getItem(username) != null)
    {
        var profileString = localStorage.getItem(username).split(",");
        console.log("Profile String = " + profileString);
        console.log("Profile Array = " + profileArray);

        if(typeof(Storage)!=="undefined")
        {
            localStorage["GetData"] = username;
        }
    }
}


/**
 * Add item to cart array
 * TO DO: Add functionality to updateCookie()
 */
function addToCart(item)
{
    if(getCookieArray('loggedIn') != "null")
    {
        var itemName, itemPrice;
        switch(item)
        {
            case 1:
            {
                //Barista Express 870XL
                itemName = "Barista Express 870XL";
                itemPrice = 699.95;
                break;
            }
            case 2:
            {
                //Ninja Coffee Bar
                itemName = "Ninja Coffee Bar";
                itemPrice = 99.99;
                break;
            }
            case 3:
            {
                //Hario V60 Ceramic
                itemName = "Hario V60 Ceramic";
                itemPrice = 19.99;
                break;
            }
            case 4:
            {
                //Bottomless Portafilter 54mm
                itemName = "Bottomless Portafilter 54mm";
                itemPrice = 69.99;
                break;
            }
            case 5:
            {
                //Water Tank Filters
                itemName = "Water Tank Filters";
                itemPrice = 9.99;
                break;
            }
            case 6:
            {
                //V60 Unbleached Filters
                itemName = "V60 Unbleached Filters";
                itemPrice = 9.99;
                break;
            }
            case 7:
            {
                //Coffee Beans (1lb.)
                itemName = "Coffee Beans (1lb.)";
                itemPrice = 16.99;
                break;
            }
            case 8:
            {
                //Coffee Beans (5lbs.)
                itemName = "Coffee Beans (5lbs.)";
                itemPrice = 89.99;
                break;
            }
            default:
            {
                console.log("Invalid item number!");
                itemName = "INVALID_ITEM"; 
                itemPrice = 0.00;
                break;
            }
            
        }

        cart.push(itemName, itemPrice);
        document.getElementById('cart').style.display = "block";

        //UPDATE CART COOKIE
        setCookie("cart", JSON.stringify(cart), 1);
        
        //added to cart msg..?
        var addedMsg = document.getElementById("addedToCart");
        addedMsg.style.display = "block";
        if(test != true)
        {
            var timer = setTimeout(function()
            {
                addedMsg.style.display = "none";
            }, 1000);
        }
        else
        {
            console.log("Redirect timer disabled in test mode. Use navigation buttons to navigate pages.");
        }
    }
    else
    {
        window.alert("You must be logged in to place orders!");
    }
}

/**
 * 
 * @param {*} item Subdirectory to browse to
 */
function goToPage(item)
{
    var nextPage = window.location.href.substring(0, window.location.href.indexOf(currentPageTitle));

    switch(item)
    {
        case "home":
        {
            nextPage += "index.html";
            break;   
        }

        case "about":
        {
            nextPage += "sections/about/index.html";
            break;
        }

        case "people":
        {
            nextPage += "sections/people/index.html";
            break;
        }

        case "blog":
        {
            nextPage += "sections/blog/index.html";
            break;
        }

        case "products":
        {
            nextPage += "sections/products/index.html";
            break;
        }

        case "register_login":
        {
            nextPage += "sections/register_login/index.html";
            break;
        }

        case "contact":
        {
            nextPage += "sections/contact/index.html";
            break;   
        }

        case "secured":
            nextPage += "sections/secured/index.html";

        default:
        {
            //404biatch
            break;
        }
    }
    open(nextPage, "_self", "", false);
}